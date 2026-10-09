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

  // 기존 등록된 항목의 이름 및 ID 수집 (중복 등록 방지)
  const existingItems = [
    ...(Array.isArray(localInfo)
      ? localInfo
      : [...(localInfo.events || []), ...(localInfo.benefits || [])]),
  ];

  const existingNames = new Set(
    existingItems
      .map((i) => (i.name || i.title || "").trim())
      .filter(Boolean)
  );
  const existingIds = new Set(
    existingItems
      .map((i) => String(i.id || "").trim())
      .filter(Boolean)
  );

  // [탐색 우선순위] 성남시 -> 광주시 -> 하남시 -> 구리시 -> 경기도 전체
  const REGION_PRIORITY = [
    { name: "성남시", query: "성남", defaultLocation: "성남시", defaultTarget: "성남시민" },
    { name: "광주시", query: "경기도 광주시", defaultLocation: "광주시", defaultTarget: "광주시민" },
    { name: "하남시", query: "하남시", defaultLocation: "하남시", defaultTarget: "하남시민" },
    { name: "구리시", query: "구리시", defaultLocation: "구리시", defaultTarget: "구리시민" },
    { name: "경기도", query: "경기도", defaultLocation: "경기도", defaultTarget: "경기도민" },
  ];

  const endpoint = "https://api.odcloud.kr/api/gov24/v3/serviceList";
  const perPage = 30; // 1페이지당 30개씩 조회
  const maxPagesPerRegion = 3; // 각 지역당 최대 3페이지(총 90건) 탐색

  let selectedItem = null;
  let selectedRegion = null;

  console.log("새로운 공공서비스 정보 탐색을 시작합니다...");

  // 지역별 우선순위에 따라 순차 탐색
  for (const region of REGION_PRIORITY) {
    console.log(`[탐색 중] ${region.name} 데이터를 확인합니다...`);

    for (let page = 1; page <= maxPagesPerRegion; page++) {
      const url = `${endpoint}?page=${page}&perPage=${perPage}&cond%5B%EC%86%8C%EA%B4%80%EA%B8%B0%EA%B4%80%EB%AA%85%3A%3ALIKE%5D=${encodeURIComponent(
        region.query
      )}&returnType=JSON&serviceKey=${encodeURIComponent(publicDataApiKey)}`;

      let items = [];
      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`[${region.name}] ${page}페이지 호출 실패 (상태 코드: ${res.status})`);
          break;
        }
        const data = await res.json();
        items = data.data || [];
      } catch (fetchErr) {
        console.warn(`[${region.name}] ${page}페이지 네트워크 오류:`, fetchErr.message);
        break;
      }

      if (items.length === 0) {
        // 더 이상 해당 지역의 데이터가 없으면 다음 지역으로
        break;
      }

      // 아직 등록되지 않은 새로운 항목 찾기
      for (const item of items) {
        const itemName = (item["서비스명"] || item.name || item.title || "").trim();
        const itemId = String(item["서비스ID"] || item.id || "").trim();

        if (itemName && !existingNames.has(itemName) && (!itemId || !existingIds.has(itemId))) {
          selectedItem = item;
          selectedRegion = region;
          break;
        }
      }

      if (selectedItem) break;
    }

    if (selectedItem) {
      console.log(`[발견!] ${region.name}에서 등록되지 않은 새로운 서비스를 찾았습니다: ${selectedItem["서비스명"]}`);
      break;
    } else {
      console.log(`[완료] ${region.name}에는 아직 등록되지 않은 새 데이터가 없어 다음 지역을 확인합니다.`);
    }
  }

  if (!selectedItem) {
    console.log("모든 우선순위 지역을 확인했으나 새로운 데이터가 없습니다.");
    return;
  }

  // [Gemini AI 가공] 발견한 공공데이터 1건을 깔끔한 JSON으로 요약 및 변환
  const prompt = `아래 공공서비스 데이터를 분석해서 웹사이트에 표시할 알기 쉬운 JSON 객체로 변환해줘.
지역: ${selectedRegion.name}

형식:
{
  "id": "${selectedItem["서비스ID"] || Date.now()}",
  "name": "서비스명",
  "category": "혜택",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD 또는 상시",
  "location": "${selectedRegion.defaultLocation}",
  "target": "${selectedRegion.defaultTarget}",
  "summary": "지원 내용과 혜택을 시민들이 알기 쉽게 설명한 1~2줄 요약",
  "link": "${selectedItem["상세조회URL"] || selectedItem["사이트URL"] || "#"}"
}

규칙:
1. category는 축제/문화/행사면 '행사', 지원금/수당/복지/감면/대출이자 등은 '혜택'으로 지정해.
2. startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 입력해.
3. 지원대상(target)은 일반 시민이 이해하기 쉬운 표현으로 정리해.
4. 반드시 유효한 JSON 형식만 출력하고 백틱이나 추가 설명 텍스트는 일체 넣지 마.

데이터:
${JSON.stringify(selectedItem, null, 2)}`;

  let processedItem = null;
  try {
    const geminiEndpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent";

    const geminiRes = await fetch(geminiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiApiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiRes.ok) {
      console.error(`Gemini API 요청 실패 (상태 코드: ${geminiRes.status})`);
      return;
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    processedItem = JSON.parse(cleanJson);
  } catch (err) {
    console.error("Gemini AI 가공 중 오류 발생:", err);
    return;
  }

  if (!processedItem) {
    console.error("가공된 데이터가 올바르지 않습니다.");
    return;
  }

  // [파일 저장] local-info.json 파일에 새 항목 추가
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const targetCategory = processedItem.category === "행사" ? "events" : "benefits";

    if (Array.isArray(localInfo)) {
      localInfo.push(processedItem);
    } else {
      localInfo.lastUpdated = todayStr;
      if (!localInfo[targetCategory]) {
        localInfo[targetCategory] = [];
      }

      const itemToSave = {
        id: processedItem.id ? String(processedItem.id) : `${targetCategory === "events" ? "event" : "benefit"}-${Date.now()}`,
        name: processedItem.name || selectedItem["서비스명"] || "",
        title: processedItem.name || selectedItem["서비스명"] || "",
        category: processedItem.category || (targetCategory === "events" ? "행사" : "혜택"),
        startDate: processedItem.startDate || todayStr,
        endDate: processedItem.endDate || "상시",
        location: processedItem.location || selectedRegion.defaultLocation,
        target: processedItem.target || selectedRegion.defaultTarget,
        summary: processedItem.summary || selectedItem["서비스목적요약"] || "",
        link: processedItem.link && processedItem.link !== "#" ? processedItem.link : (selectedItem["상세조회URL"] || "#"),
      };

      localInfo[targetCategory].push(itemToSave);
    }

    fs.writeFileSync(localInfoPath, JSON.stringify(localInfo, null, 2), "utf-8");
    console.log(
      `[성공] [${selectedRegion.name}] 새 데이터 추가 완료: ${processedItem.name || selectedItem["서비스명"]}`
    );
  } catch (saveErr) {
    console.error("local-info.json 파일 저장 중 오류 발생:", saveErr);
  }
}

main();
