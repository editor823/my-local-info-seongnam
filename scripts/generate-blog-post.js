const fs = require("fs");
const path = require("path");

async function main() {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
    return;
  }

  // [1단계] 최신 데이터 및 기존 블로그 글 목록 확인
  const localInfoPath = path.join(process.cwd(), "public", "data", "local-info.json");
  const postsDir = path.join(process.cwd(), "src", "content", "posts");

  if (!fs.existsSync(localInfoPath)) {
    console.error("public/data/local-info.json 파일이 존재하지 않습니다.");
    return;
  }

  let localInfoData;
  try {
    const rawData = fs.readFileSync(localInfoPath, "utf-8");
    localInfoData = JSON.parse(rawData);
  } catch (err) {
    console.error("local-info.json 파일 읽기 실패:", err);
    return;
  }

  let allItems = [];
  if (Array.isArray(localInfoData)) {
    allItems = localInfoData;
  } else {
    allItems = [
      ...(localInfoData.events || []),
      ...(localInfoData.benefits || []),
    ];
  }

  if (allItems.length === 0) {
    console.log("공공서비스 데이터가 비어 있습니다.");
    return;
  }

  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  // 기존 작성된 블로그 파일들 전체 내용 읽기
  const existingFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));
  const existingPostContents = existingFiles.map((file) => {
    try {
      return fs.readFileSync(path.join(postsDir, file), "utf-8");
    } catch {
      return "";
    }
  });

  // [2단계] 아직 블로그 글로 작성되지 않은 항목 찾기 (최신 항목부터 우선 탐색)
  let targetItem = null;

  // 최신 등록된 항목부터 역순으로 탐색
  for (let i = allItems.length - 1; i >= 0; i--) {
    const item = allItems[i];
    const itemName = (item.name || item.title || "").trim();
    if (!itemName) continue;

    // 기존 글들의 본문이나 제목에 서비스명이 포함되어 있는지 검사
    const isAlreadyWritten = existingPostContents.some((content) =>
      content.includes(itemName)
    );

    if (!isAlreadyWritten) {
      targetItem = item;
      break;
    }
  }

  if (!targetItem) {
    console.log("모든 항목에 대해 이미 블로그 글이 작성되어 있습니다.");
    return;
  }

  const targetName = targetItem.name || targetItem.title || "";
  const targetLocation = targetItem.location || "우리 동네";
  console.log(`[선정 완료] 블로그 글로 작성할 항목: "${targetName}" (지역: ${targetLocation})`);

  // [3단계] Gemini AI로 블로그 글 생성
  const todayStr = new Date().toISOString().split("T")[0];
  const geminiEndpoint =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent";

  const prompt = `당신은 실생활에 꼭 필요한 정부 복지 및 지역 생활 정보를 친절하고 깊이 있게 해설해 주는 전문 에디터입니다.
아래 공공서비스 정보를 바탕으로 독자(${targetLocation} 및 인근 지역 주민)에게 실질적인 도움이 되는 고품질 블로그 글(1,500자 이상)을 정성껏 작성해 주세요.

정보:
${JSON.stringify(targetItem, null, 2)}

[작성 가이드라인]
1. 단순 공고문 복사가 아니라 독자가 바로 이해할 수 있는 친근하고 명확한 어조로 작성할 것
2. 이 혜택을 꼭 챙겨야 하는 이유 3가지
3. 신청 자격 및 필수 구비 서류 체크리스트
4. 신청 시 실수하기 쉬운 주의사항 팁
5. 자주 묻는 질문(FAQ) 2가지와 답변

반드시 아래 YAML 프론트매터 형식으로만 출력하고 다른 설명 텍스트는 출력하지 마세요:
---
title: (클릭하고 싶게 만드는 매력적이고 유익한 제목)
date: ${todayStr}
summary: (이 글의 핵심 혜택을 명확히 요약한 1~2문장)
category: ${targetItem.category || "혜택정보"}
tags: [${targetLocation}, 생활정보, 지원금, 복지혜택]
---

(본문 내용: 마크다운 소제목 ###, 글머리 기호, 표 또는 체크리스트를 풍부하게 활용하여 1,500자 이상으로 길고 알차게 작성)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명을 출력해줘. 키워드는 간결한 영문 소문자 케밥케이스로.`;

  let responseText = "";
  try {
    const res = await fetch(geminiEndpoint, {
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

    if (!res.ok) {
      console.error(`Gemini API 요청 실패 (상태 코드: ${res.status})`);
      return;
    }

    const data = await res.json();
    responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (err) {
    console.error("Gemini API 호출 중 에러 발생 (기존 파일 유지):", err);
    return;
  }

  if (!responseText) {
    console.error("Gemini AI로부터 응답을 받지 못했습니다.");
    return;
  }

  // [4단계] 파일 저장
  try {
    const lines = responseText.trim().split("\n");
    let filename = `${todayStr}-info-${Date.now().toString().slice(-4)}.md`;
    const postLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith("FILENAME:")) {
        const parsedName = line
          .replace("FILENAME:", "")
          .trim()
          .replace(/\.md$/, "");
        if (parsedName) {
          filename = `${parsedName}.md`;
        }
      } else {
        postLines.push(line);
      }
    }

    const finalPostContent = postLines.join("\n").trim() + "\n";
    const targetFilePath = path.join(postsDir, filename);

    fs.writeFileSync(targetFilePath, finalPostContent, "utf-8");
    console.log(`[성공] 새로운 블로그 글 생성 완료: ${filename}`);
  } catch (err) {
    console.error("블로그 글 저장 중 에러 발생:", err);
  }
}

main();
