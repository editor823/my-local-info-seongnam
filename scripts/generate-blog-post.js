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

  // 기존 작성된 블로그 파일들 전체 내용 및 slug 읽기
  const existingFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));
  const existingPostContents = existingFiles.map((file) => {
    try {
      return fs.readFileSync(path.join(postsDir, file), "utf-8");
    } catch {
      return "";
    }
  });

  // [2단계] 아직 블로그 글로 작성되지 않은 성남시 항목 찾기
  let targetItem = null;

  for (const item of allItems) {
    const itemName = (item.name || item.title || "").trim();
    if (!itemName) continue;

    // 만약 이미 지정된 slug 파일이 존재하면 건너뜀
    if (item.slug && existingFiles.includes(`${item.slug}.md`)) {
      continue;
    }

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
    console.log("모든 항목에 대해 이미 고품질 블로그 글이 작성되어 있습니다.");
    return;
  }

  const targetName = targetItem.name || targetItem.title || "";
  const targetCategory = targetItem.category || "복지/혜택";
  console.log(`[선정 완료] 블로그 글로 작성할 성남시 항목: "${targetName}" (분야: ${targetCategory})`);

  // [3단계] 성남시 전문 큐레이터 고품질 프롬프트 구성
  const todayStr = new Date().toISOString().split("T")[0];
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiApiKey}`;

  const systemPrompt = `너는 경기도 성남시(수정구·중원구·분당구)에서 10년 넘게 생활 혜택과 정책을 주민 눈높이에서 전달해온 전문 생활정보 큐레이터야.
아래 제공하는 정보를 바탕으로 구글 애드센스 승인 기준에 완벽히 부합하는 2,500자 이상의 고품질 오리지널 블로그 글을 마크다운(.md) 형식으로 작성해줘.

■ 대상 정보:
- 제목/사업명: ${targetName}
- 소관 기관: ${targetItem.location || "성남시 / 유관기관"}
- 지원 대상: ${targetItem.target || "성남시민"}
- 지원 내용: ${targetItem.summary || "상세 지원 혜택"}
- 공식 링크: ${targetItem.link || "https://www.seongnam.go.kr"}
- 카테고리: ${targetCategory}
- 작성 기준일: ${todayStr}

■ 필수 작성 규칙 (반드시 철저히 준수):
1. 어투: 흔한 AI 상투어("안녕하세요!", "알아보겠습니다", "3가지 이유", "지금 바로 시작하겠습니다")는 일절 쓰지 말고, 성남시 동 행정복지센터를 직접 방문해 본 에디터처럼 친절하면서도 전문적인 구어체로 작성해줘.
2. 제목 공식: [2026 성남시/${targetCategory}] ${targetName} 핵심 총정리: 지원 자격, 신청 방법 및 실전 꿀팁
3. 필수 구성 요소 (빠짐없이 모두 포함하여 풍성하게 작성):
   - ① 공감 인트로 (성남시민 실생활에 왜 중요한지, 주거비/물가 체감)
   - ② 핵심 혜택 및 지원 금액 상세 설명
   - ③ 자격 조건 및 소득 인정액 기준 (★한눈에 보는 비교 표/Table 필수 포함)
   - ④ 단계별 신청 절차 (1단계~4단계 세부 가이드 및 필수 서류)
   - ⑤ [에디터 실전 꿀팁] (성남 관내 구청·주민센터 이용 팁, 자주 반려되는 실수, 대기시간 줄이는 법)
   - ⑥ 자주 묻는 질문 3~5선 (Q&A 형식으로 헷갈리는 점 속 시원히 해결)
   - ⑦ 요약 및 공식 문의처 안내 (성남시청 소관 부서 및 성남시 콜센터 1577-3100 포함)
4. 서식 및 분량:
   - 본문 상단에 반드시 아래 YAML Frontmatter를 포함할 것:
---
title: "[2026 성남시/${targetCategory}] ${targetName} 핵심 총정리: 지원 자격, 신청 방법 및 실전 꿀팁"
date: "${todayStr}"
category: "${targetCategory}"
summary: (이 글의 핵심 혜택과 지원 자격을 명확히 요약한 2문장)
tags: ["성남시", "${targetName.replace(/\s+/g, "")}", "성남시복지", "정부지원금", "생활혜택"]
---
   - 글 중간중간 표(Table), 인용구(>), 체크리스트를 적극적으로 활용해서 가독성을 높일 것.
   - 글자 수는 공백 포함 2,500자 이상(공고문 단순 복붙 금지, 해설 중심 오리지널 작성)으로 알차게 채울 것.
   - 글의 가장 마지막 줄에는 반드시 아래 형식으로 파일명을 표기할 것:
FILENAME: ${todayStr}-seongnam-[영문키워드슬러그]`;

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
            parts: [{ text: systemPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!res.ok) {
      console.error(`Gemini API 요청 실패 (상태 코드: ${res.status})`);
      return;
    }

    const data = await res.json();
    responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (err) {
    console.error("Gemini API 호출 중 에러 발생:", err);
    return;
  }

  if (!responseText) {
    console.error("Gemini AI로부터 응답을 받지 못했습니다.");
    return;
  }

  // [4단계] 고품질 가드레일 검증 (Quality Guardrail)
  // 1. 최소 글자수 검증 (검수봇 통과 기준인 공백 포함 2,000자 이상)
  if (responseText.length < 2000) {
    console.warn(`[품질 경고] 생성된 글자 수(${responseText.length}자)가 검수 통과 기준(최소 2,000자)에 미달하여 저품질 방지를 위해 발행을 보류합니다.`);
    return;
  }

  // 2. 금지된 AI 상투어 전수 검사 및 자동 정제
  const bannedKeywords = [
    "안녕하세요!",
    "알아보겠습니다",
    "살펴보도록 하겠습니다",
    "지금 바로 시작하겠습니다",
    "지금 바로 알아보겠습니다",
    "3가지 이유",
  ];
  const hasBannedKeyword = bannedKeywords.some((keyword) => responseText.includes(keyword));
  if (hasBannedKeyword) {
    console.warn("[품질 경고] AI 상투어가 포함되어 있어 전문 에디터 어투로 정제합니다.");
    responseText = responseText
      .replace(/안녕하세요!/g, "")
      .replace(/살펴보도록 하겠습니다\.?/g, "살펴봅니다.")
      .replace(/지금 바로 시작하겠습니다\.?/g, "자세히 안내해 드립니다.")
      .replace(/지금 바로 알아보겠습니다\.?/g, "살펴봅니다.")
      .replace(/알아보겠습니다\.?/g, "살펴봅니다.")
      .replace(/3가지 이유/g, "핵심 포인트");
  }

  // [5단계] 마크다운 파일 저장
  try {
    const lines = responseText.trim().split("\n");
    let filename = `${todayStr}-seongnam-${Date.now().toString().slice(-4)}.md`;
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

    // 마크다운 백틱 코드블록 래핑(```markdown ... ```)이 있으면 제거
    let finalPostContent = postLines.join("\n").trim();
    if (finalPostContent.startsWith("```markdown")) {
      finalPostContent = finalPostContent.replace(/^```markdown\s*/, "");
    } else if (finalPostContent.startsWith("```")) {
      finalPostContent = finalPostContent.replace(/^```\s*/, "");
    }
    if (finalPostContent.endsWith("```")) {
      finalPostContent = finalPostContent.replace(/```$/, "").trim();
    }
    finalPostContent += "\n";

    const targetFilePath = path.join(postsDir, filename);
    fs.writeFileSync(targetFilePath, finalPostContent, "utf-8");
    console.log(`[고품질 발행 성공] 새로운 성남시 블로그 글 생성 완료: ${filename} (용량: ${finalPostContent.length}자)`);
  } catch (err) {
    console.error("블로그 글 저장 중 에러 발생:", err);
  }
}

main();
