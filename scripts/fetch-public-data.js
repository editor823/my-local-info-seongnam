const fs = require("fs");
const path = require("path");

async function main() {
  const publicDataApiKey = process.env.PUBLIC_DATA_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!publicDataApiKey) {
    console.error("PUBLIC_DATA_API_KEY 환경변수가 설정되지 않았습니다.");
    return;
  }
  if (!geminiApiKey) {
    console.error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
    return;
  }

  const localInfoPath = path.join(process.cwd(), "public", "data", "local-info.json");
  let localInfo = { lastUpdated: "", events: [], benefits: [] };

  try {
    if (fs.existsSync(localInfoPath)) {
      const fileRaw = fs.readFileSync(localInfoPath, "utf-8");
      localInfo = JSON.parse(fileRaw);
    }
  } catch (err) {
    console.error("기존 local-info.json 읽기 실패:", err);
    return;
  }

  // [1단계] 공공데이터포털 API에서 데이터 가져오기
  const endpoint = "https://api.odcloud.kr/api/gov24/v3/serviceList";
  const url = `${endpoint}?page=1&perPage=20&returnType=JSON&serviceKey=${encodeURIComponent(
    publicDataApiKey
  )}`;

  let serviceItems = [];
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`공공데이터 API 요청 실패 (상태 코드: ${res.status})`);
      return;
    }
    const data = await res.json();
    serviceItems = data.data || [];
  } catch (err) {
    console.error("공공데이터 API 호출 중 오류 발생:", err);
    return;
  }

  if (!Array.isArray(serviceItems) || serviceItems.length === 0) {
    console.log("새로운 데이터가 없습니다");
    return;
  }

  // 필터링: 성남 -> 경기 -> 전체
  const matchesSeongnam = serviceItems.filter((item) => {
    const combined = `${item["서비스명"] || ""} ${item["서비스목적요약"] || ""} ${
      item["지원대상"] || ""
    } ${item["소관기관명"] || ""}`;
    return combined.includes("성남");
  });

  const matchesGyeonggi = serviceItems.filter((item) => {
    const combined = `${item["서비스명"] || ""} ${item["서비스목적요약"] || ""} ${
      item["지원대상"] || ""
    } ${item["소관기관명"] || ""}`;
    return combined.includes("경기");
  });

  let candidateItems = [];
  if (matchesSeongnam.length > 0) {
    candidateItems = matchesSeongnam;
  } else if (matchesGyeonggi.length > 0) {
    candidateItems = matchesGyeonggi;
  } else {
    candidateItems = serviceItems;
  }

  // [2단계] 기존 데이터와 비교 (name/title 기준)
  const existingNames = new Set([
    ...(Array.isArray(localInfo)
      ? localInfo.map((i) => i.name || i.title)
      : [
          ...(localInfo.events || []).map((i) => i.name || i.title),
          ...(localInfo.benefits || []).map((i) => i.name || i.title),
        ]),
  ]);

  const newItems = candidateItems.filter((item) => {
    const itemName = item["서비스명"] || item.name || item.title || "";
    return itemName && !existingNames.has(itemName);
  });

  if (newItems.length === 0) {
    console.log("새로운 데이터가 없습니다");
    return;
  }

  const selectedItem = newItems[0];

  // [3단계] Gemini AI로 새 항목 1개만 가공 (최신 Google Gen AI Interactions API 호환)
  const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

데이터:
${JSON.stringify(selectedItem, null, 2)}`;

  let processedItem = null;
  try {
    const geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent";

    const geminiRes = await fetch(geminiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!geminiRes.ok) {
      console.error(`Gemini API 요청 실패 (상태 코드: ${geminiRes.status})`);
      return;
    }

    const geminiData = await geminiRes.json();
    const rawText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 마크다운 코드블록 제거 후 JSON 파싱
    const jsonMatch = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    processedItem = JSON.parse(jsonMatch);
  } catch (err) {
    console.error("Gemini AI 가공 중 오류 발생 (기존 데이터 유지):", err);
    return;
  }

  if (!processedItem) {
    console.error("가공된 데이터가 유효하지 않습니다.");
    return;
  }

  // [4단계] 기존 데이터에 추가
  try {
    const todayStr = new Date().toISOString().split("T")[0];

    if (Array.isArray(localInfo)) {
      localInfo.push(processedItem);
    } else {
      localInfo.lastUpdated = todayStr;
      const targetCategory = processedItem.category === "행사" ? "events" : "benefits";
      if (!localInfo[targetCategory]) {
        localInfo[targetCategory] = [];
      }
      
      const itemToSave = {
        id: processedItem.id ? String(processedItem.id) : `${targetCategory === "events" ? "event" : "benefit"}-${Date.now()}`,
        name: processedItem.name || processedItem.title || "",
        title: processedItem.name || processedItem.title || "",
        category: processedItem.category || (targetCategory === "events" ? "행사" : "혜택"),
        startDate: processedItem.startDate || todayStr,
        endDate: processedItem.endDate || "상시",
        location: processedItem.location || "성남시",
        target: processedItem.target || "성남시민",
        summary: processedItem.summary || "",
        link: processedItem.link || "#",
      };

      localInfo[targetCategory].push(itemToSave);
    }

    fs.writeFileSync(localInfoPath, JSON.stringify(localInfo, null, 2), "utf-8");
    console.log("새로운 공공서비스 정보 1건 추가 완료:", processedItem.name || processedItem.title);
  } catch (err) {
    console.error("local-info.json 파일 저장 중 오류 발생 (기존 데이터 유지):", err);
  }
}

main();
