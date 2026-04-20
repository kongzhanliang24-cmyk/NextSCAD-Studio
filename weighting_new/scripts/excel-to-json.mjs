/**
 * 讀取磅秤官網數據 Excel 並轉換為 JSON 文件
 * 運行: npm run gen:json
 * 預設讀取: weighting_data_template.xlsx
 * 預設輸出: ./src/data/
 *
 * 自訂: npm run gen:json -- --input=xxx.xlsx --output=./src/data
 */

import XLSX from "xlsx";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { mkdirSync, writeFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Parse CLI args
const args = process.argv.slice(2);
function getArg(name, defaultVal) {
  const found = args.find((a) => a.startsWith(`--${name}=`));
  return found ? found.split("=")[1] : defaultVal;
}

const INPUT_PATH = resolve(ROOT, getArg("input", "weighting_data_template.xlsx"));
const OUTPUT_DIR = resolve(ROOT, getArg("output", "./content/data"));

// ─── Helpers ───

function parseHeader(raw) {
  // "slug(產品標識)" -> "slug"
  if (!raw) return "";
  return raw.split("(")[0].trim();
}

function readSheet(wb, sheetName) {
  const ws = wb.Sheets[sheetName];
  if (!ws) {
    console.warn(`⚠️  找不到 Sheet: ${sheetName}`);
    return [];
  }
  const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  if (rawRows.length < 2) return [];

  const headers = rawRows[0].map(parseHeader);
  const data = [];
  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    // Skip empty rows
    if (row.every((v) => v === "" || v === null || v === undefined)) continue;
    const record = {};
    headers.forEach((h, idx) => {
      if (h) record[h] = row[idx] != null ? String(row[idx]).trim() : "";
    });
    data.push(record);
  }
  return data;
}

function i18n(zh, en) {
  return { zh: zh || "", en: en || "" };
}

function parsePipeList(value) {
  // "中文|English,中文|English" -> [{zh, en}, ...]
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((item) => {
      if (item.includes("|")) {
        const [zh, en] = item.split("|", 2);
        return { zh: zh.trim(), en: en.trim() };
      }
      return { zh: item, en: item };
    });
}

function parseDownloads(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((item) => {
      if (item.includes("|")) {
        const [name, url] = item.split("|", 2);
        return { name: name.trim(), url: url.trim() };
      }
      return { name: item, url: "" };
    });
}

function parseFaq(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((item) => {
      if (item.includes("|")) {
        const [question, answer] = item.split("|", 2);
        return { question: question.trim(), answer: answer.trim() };
      }
      return { question: item, answer: "" };
    });
}

function parseResults(value) {
  // "40%|稱重效率提升|Weighing efficiency increase,2人|人工成本降低|Labor cost reduced"
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((item) => {
      const parts = item.split("|");
      if (parts.length >= 3) {
        return { number: parts[0].trim(), label: { zh: parts[1].trim(), en: parts[2].trim() } };
      } else if (parts.length === 2) {
        return { number: parts[0].trim(), label: { zh: parts[1].trim(), en: parts[1].trim() } };
      }
      return { number: item, label: { zh: "", en: "" } };
    });
}

function commaList(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function saveJson(data, filePath) {
  const dir = dirname(filePath);
  mkdirSync(dir, { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`  ✅ ${filePath}`);
}

// ─── Builders ───

function buildCategories(rows) {
  return rows.map((r) => ({
    slug: r.category_slug || "",
    name: i18n(r.name_zh, r.name_en),
    description: i18n(r.description_zh, r.description_en),
    image: r.image || "",
  }));
}

function buildProducts(productsData, featuresData, specsData) {
  // Group features & specs by product_slug
  const featuresMap = {};
  for (const f of featuresData) {
    const slug = f.product_slug || "";
    if (!featuresMap[slug]) featuresMap[slug] = [];
    featuresMap[slug].push({
      icon: f.icon || "",
      title: i18n(f.title_zh, f.title_en),
      desc: i18n(f.desc_zh, f.desc_en),
    });
  }

  const specsMap = {};
  for (const s of specsData) {
    const slug = s.product_slug || "";
    if (!specsMap[slug]) specsMap[slug] = [];
    specsMap[slug].push({
      name: i18n(s.name_zh, s.name_en),
      value: s.value || "",
    });
  }

  const products = {};
  for (const r of productsData) {
    const slug = r.slug;
    if (!slug) continue;
    products[slug] = {
      slug,
      model: r.model || "",
      category: r.category_slug || "",
      title: i18n(r.title_zh, r.title_en),
      short_desc: i18n(r.short_desc_zh, r.short_desc_en),
      hero_image: r.hero_image || "",
      video_url: r.video_url || "",
      features: featuresMap[slug] || [],
      specs: specsMap[slug] || [],
      applications: i18n(r.applications_zh, r.applications_en),
      certifications: commaList(r.certifications),
      downloads: parseDownloads(r.downloads),
      faq: parseFaq(r.faq),
    };
  }
  return products;
}

function buildSolutions(solutionsData, featuresData) {
  const featuresMap = {};
  for (const f of featuresData) {
    const slug = f.solution_slug || "";
    if (!featuresMap[slug]) featuresMap[slug] = [];
    featuresMap[slug].push({
      icon: f.icon || "",
      title: i18n(f.title_zh, f.title_en),
      desc: i18n(f.desc_zh, f.desc_en),
    });
  }

  const solutions = {};
  for (const r of solutionsData) {
    const slug = r.slug;
    if (!slug) continue;
    solutions[slug] = {
      slug,
      title: i18n(r.title_zh, r.title_en),
      subtitle: i18n(r.subtitle_zh, r.subtitle_en),
      problem_desc: i18n(r.problem_desc_zh, r.problem_desc_en),
      architecture_image: r.architecture_image || "",
      process_desc: i18n(r.process_desc_zh, r.process_desc_en),
      features: featuresMap[slug] || [],
      technical_spec: i18n(r.technical_spec_zh, r.technical_spec_en),
      industries: parsePipeList(r.industries),
      value_desc: i18n(r.value_desc_zh, r.value_desc_en),
    };
  }
  return solutions;
}

function buildCases(casesData) {
  const cases = {};
  for (const r of casesData) {
    const slug = r.slug;
    if (!slug) continue;
    cases[slug] = {
      slug,
      title: i18n(r.title_zh, r.title_en),
      industry_slug: r.industry_slug || "",
      industry: i18n(r.industry_zh, r.industry_en),
      industry_label: i18n(r.industry_zh, r.industry_en),
      system_used: i18n(r.system_used_zh || r.system_used || "", r.system_used_en || r.system_used || ""),
      result_summary: i18n(r.result_summary_zh, r.result_summary_en),
      background: i18n(r.background_zh, r.background_en),
      pain_points: parsePipeList(r.pain_points),
      solution: {
        system: i18n(r.system_used_zh || r.system_used || "", r.system_used_en || r.system_used || ""),
        details: parsePipeList(r.solution_details),
      },
      cover_image: r.cover_image || "",
      gallery: commaList(r.gallery),
      results: parseResults(r.results),
      result_detail: i18n(r.result_detail_zh, r.result_detail_en),
    };
  }
  return cases;
}

// ─── Main ───

function main() {
  console.log(`📖 讀取 Excel: ${INPUT_PATH}`);
  const wb = XLSX.readFile(INPUT_PATH);

  const categoriesData = readSheet(wb, "產品類型");
  const productsData = readSheet(wb, "產品基本資訊");
  const productFeatures = readSheet(wb, "產品賣點");
  const productSpecs = readSheet(wb, "產品規格");
  const solutionsData = readSheet(wb, "磅秤系統");
  const solutionFeatures = readSheet(wb, "系統功能");
  const casesData = readSheet(wb, "案例資訊");

  console.log("\n📊 數據統計:");
  console.log(`  產品類型: ${categoriesData.length} 條`);
  console.log(`  產品: ${productsData.length} 條`);
  console.log(`  產品賣點: ${productFeatures.length} 條`);
  console.log(`  產品規格: ${productSpecs.length} 條`);
  console.log(`  磅秤系統: ${solutionsData.length} 條`);
  console.log(`  系統功能: ${solutionFeatures.length} 條`);
  console.log(`  案例: ${casesData.length} 條`);

  console.log(`\n📦 生成 JSON 文件到: ${OUTPUT_DIR}`);

  // 1. Categories (standalone file)
  const categories = buildCategories(categoriesData);
  saveJson(categories, join(OUTPUT_DIR, "categories.json"));

  // 2. Products — index.json 格式: { categories: [...], products: [...] }
  const products = buildProducts(productsData, productFeatures, productSpecs);
  const productIndexItems = [];
  for (const [slug, product] of Object.entries(products)) {
    saveJson(product, join(OUTPUT_DIR, "products", `${slug}.json`));
    productIndexItems.push({
      slug: product.slug,
      model: product.model,
      category: product.category,
      title: product.title,
      short_desc: product.short_desc,
      hero_image: product.hero_image,
      max_capacity: product.specs.find(s => s.name.zh.includes("秤量"))?.value || "",
      division: product.specs.find(s => s.name.zh.includes("分度"))?.value || "",
    });
  }
  const productCategoryIndex = categories.map(c => ({
    slug: c.slug,
    name: c.name,
  }));
  saveJson(
    { categories: productCategoryIndex, products: productIndexItems },
    join(OUTPUT_DIR, "products", "index.json")
  );

  // 3. Solutions — index.json 格式: { solutions: [...] }
  const solutions = buildSolutions(solutionsData, solutionFeatures);
  const solutionIndexItems = [];
  for (const [slug, solution] of Object.entries(solutions)) {
    saveJson(solution, join(OUTPUT_DIR, "solutions", `${slug}.json`));
    solutionIndexItems.push({
      slug: solution.slug,
      title: solution.title,
      subtitle: solution.subtitle,
      short_desc: solution.value_desc,
      industries: solution.industries,
    });
  }
  saveJson(
    { solutions: solutionIndexItems },
    join(OUTPUT_DIR, "solutions", "index.json")
  );

  // 4. Cases — index.json 格式: { industries: [...], cases: [...] }
  const cases = buildCases(casesData);
  // 從案例數據中提取唯一行業列表
  const industrySet = new Map();
  industrySet.set("all", { slug: "all", name: i18n("全部", "All") });
  for (const c of Object.values(cases)) {
    const indSlug = c.industry_slug || c.slug;
    if (!industrySet.has(indSlug)) {
      industrySet.set(indSlug, { slug: indSlug, name: c.industry });
    }
  }
  const caseIndexItems = [];
  for (const [slug, c] of Object.entries(cases)) {
    saveJson(c, join(OUTPUT_DIR, "cases", `${slug}.json`));
    caseIndexItems.push({
      slug: c.slug,
      title: c.title,
      industry: c.industry_slug || c.slug,
      industry_label: c.industry,
      system_used: c.system_used,
      result_summary: c.result_summary,
      cover_image: c.cover_image,
    });
  }
  saveJson(
    { industries: Array.from(industrySet.values()), cases: caseIndexItems },
    join(OUTPUT_DIR, "cases", "index.json")
  );

  const totalFiles =
    Object.keys(products).length +
    Object.keys(solutions).length +
    Object.keys(cases).length +
    4; // 4 index files
  console.log(`\n🎉 全部完成！共生成 ${totalFiles} 個 JSON 文件`);
  console.log(`📁 輸出目錄: ${OUTPUT_DIR}`);
}

main();
