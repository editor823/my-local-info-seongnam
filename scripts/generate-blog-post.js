const fs = require("fs");
const path = require("path");

async function main() {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
    return;
  }

  // [1단계] 최신 데이터 확인
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

  const latestItem = allItems[allItems.length - 1];
  const targetName = latestItem.name || latestItem.title || "";

  if (!targetName) {
    console.error("최신 항목에 이름(name/title) 정보가 없습니다.");
    return;
  }

  // src/content/posts 폴더 확인 및 기존 글 검사
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const existingFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));
  for (const file of existingFiles) {
    try {
      const fileContent = fs.readFileSync(path.join(postsDir, file), "utf-8");
      if (fileContent.includes(targetName)) {
        console.log("이미 작성된 글입니다");
        return;
      }
    } catch (err) {
      // 파일 읽기 오류는 건너뜀
    }
  }

  // [2단계] Gemini AI로 블로그 글 생성
  const todayStr = new Date().toISOString().split("T")[0];
  const geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent";

  const prompt = `당신은 실생활에 꼭 필요한 정부 복지 및 생활 정보를 친절하고 깊이 있게 해설해 주는 전문 에디터입니다.
아래 공공서비스 정보를 바탕으로 독자에게 실질적인 도움이 되는 고품질 블로그 글(1,500자 이상)을 정성껏 작성해 주세요.

정보: ${JSON.stringify(latestItem, null, 2)}

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
category: 혜택정보
tags: [핵심키워드1, 핵심키워드2, 핵심키워드3, 성남시생활정보, 정부지원금]
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

  // [3단계] 파일 저장
  try {
    const lines = responseText.trim().split("\n");
    let filename = `${todayStr}-info.md`;
    const postLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith("FILENAME:")) {
        const parsedName = line.replace("FILENAME:", "").trim().replace(/\.md$/, "");
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
    console.log(`블로그 글 생성 완료: ${filename}`);
  } catch (err) {
    console.error("블로그 글 저장 중 에러 발생 (기존 파일 유지):", err);
  }
}

main();
