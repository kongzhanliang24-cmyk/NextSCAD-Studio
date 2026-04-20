/**
 * 生成磅秤官網數據 Excel 模板
 * 運行: npm run gen:template
 * 輸出: weighting_data_template.xlsx
 */

import XLSX from "xlsx";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "..", "weighting_data_template.xlsx");

function createSheet(headers, sampleRows) {
  const data = [headers, ...sampleRows];
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws["!cols"] = headers.map((h) => ({
    wch: Math.max(h.length + 4, 18),
  }));

  return ws;
}

function main() {
  const wb = XLSX.utils.book_new();

  // ========== Sheet 1: 產品類型 ==========
  const ws1 = createSheet(
    [
      "category_slug(分類標識)",
      "name_zh(中文名稱)",
      "name_en(英文名稱)",
      "description_zh(中文簡介)",
      "description_en(英文簡介)",
      "image(分類圖片路徑)",
    ],
    [
      [
        "waterproof-industrial",
        "防水工業秤",
        "Waterproof Industrial Scale",
        "適用於高濕環境的工業級磅秤",
        "Industrial scale for high-humidity environments",
        "/assets/images/products/categories/waterproof.jpg",
      ],
      [
        "platform",
        "平台秤",
        "Platform Scale",
        "高精度工業平台秤，多種規格可選",
        "High-precision industrial platform scale",
        "/assets/images/products/categories/platform.jpg",
      ],
      [
        "counting",
        "高精度計數秤",
        "High-Precision Counting Scale",
        "精確計數，適合零件與物料管理",
        "Accurate counting for parts and material management",
        "/assets/images/products/categories/counting.jpg",
      ],
    ]
  );
  XLSX.utils.book_append_sheet(wb, ws1, "產品類型");

  // ========== Sheet 2: 產品基本資訊 ==========
  const ws2 = createSheet(
    [
      "slug(產品標識)",
      "model(型號)",
      "category_slug(所屬分類)",
      "title_zh(中文名稱)",
      "title_en(英文名稱)",
      "short_desc_zh(中文簡述)",
      "short_desc_en(英文簡述)",
      "hero_image(主圖路徑)",
      "video_url(影片URL)",
      "applications_zh(應用場景-中文)",
      "applications_en(應用場景-英文)",
      "certifications(認證，逗號分隔)",
      "downloads(下載資源，格式: 名稱|路徑，逗號分隔)",
      "faq(FAQ，格式: 問題|答案，逗號分隔)",
    ],
    [
      [
        "xz-3000",
        "XZ-3000",
        "waterproof-industrial",
        "XZ-3000平台秤",
        "XZ-3000 Platform Scale",
        "高精度工業平台秤",
        "High-precision industrial platform scale",
        "/assets/images/products/xz-3000/main.jpg",
        "http://nas.example.com/videos/xz-3000.mp4",
        "適用於食品加工、倉儲冷鏈",
        "Suitable for food processing and cold storage",
        "CE,ISO9001,OIML",
        "規格書|/downloads/xz-3000-spec.pdf,操作手冊|/downloads/xz-3000-manual.pdf",
        "是否支持定制？|支持客製化服務,保修多久？|標準保修一年",
      ],
    ]
  );
  XLSX.utils.book_append_sheet(wb, ws2, "產品基本資訊");

  // ========== Sheet 3: 產品賣點 ==========
  const ws3 = createSheet(
    [
      "product_slug(所屬產品標識)",
      "icon(圖標路徑)",
      "title_zh(賣點標題-中文)",
      "title_en(賣點標題-英文)",
      "desc_zh(賣點描述-中文)",
      "desc_en(賣點描述-英文)",
    ],
    [
      [
        "xz-3000",
        "/assets/images/icons/ip68.png",
        "IP68防水",
        "IP68 Waterproof",
        "可直接沖洗",
        "Can be washed directly",
      ],
      [
        "xz-3000",
        "/assets/images/icons/precision.png",
        "高精度",
        "High Precision",
        "進口傳感器",
        "Imported sensors",
      ],
      [
        "xz-3000",
        "/assets/images/icons/stainless.png",
        "全不銹鋼結構",
        "Full Stainless Steel",
        "SUS304材質，耐腐蝕",
        "SUS304 material, corrosion resistant",
      ],
    ]
  );
  XLSX.utils.book_append_sheet(wb, ws3, "產品賣點");

  // ========== Sheet 4: 產品規格 ==========
  const ws4 = createSheet(
    [
      "product_slug(所屬產品標識)",
      "name_zh(參數名-中文)",
      "name_en(參數名-英文)",
      "value(參數值)",
    ],
    [
      ["xz-3000", "最大秤量", "Max Capacity", "300kg"],
      ["xz-3000", "分度值", "Division", "10g"],
      ["xz-3000", "材質", "Material", "SUS304"],
      ["xz-3000", "顯示", "Display", "LED"],
      ["xz-3000", "防護等級", "Protection", "IP68"],
    ]
  );
  XLSX.utils.book_append_sheet(wb, ws4, "產品規格");

  // ========== Sheet 5: 磅秤系統 ==========
  const ws5 = createSheet(
    [
      "slug(系統標識)",
      "title_zh(系統名稱-中文)",
      "title_en(系統名稱-英文)",
      "subtitle_zh(副標題-中文)",
      "subtitle_en(副標題-英文)",
      "problem_desc_zh(痛點描述-中文)",
      "problem_desc_en(痛點描述-英文)",
      "architecture_image(架構圖路徑)",
      "process_desc_zh(操作流程-中文)",
      "process_desc_en(操作流程-英文)",
      "technical_spec_zh(技術規格-中文)",
      "technical_spec_en(技術規格-英文)",
      "value_desc_zh(客戶價值-中文)",
      "value_desc_en(客戶價值-英文)",
      "industries(適用行業，格式: 中文|英文，逗號分隔)",
    ],
    [
      [
        "warehouse-system",
        "智能倉儲稱重管理系統",
        "Smart Warehouse Weighing System",
        "實現入庫出庫數據自動化",
        "Automate inbound/outbound data management",
        "傳統倉儲稱重人工記錄易錯、無法統計、無法對接ERP",
        "Manual recording prone to errors in traditional warehouse",
        "/assets/images/solutions/warehouse-arch.png",
        "貨物上磅→系統記錄→打印標籤→數據同步ERP",
        "Weighing→System records→Print label→Sync to ERP",
        "支持多磅接入，局域網部署，支持私有化部署，支持數據庫備份",
        "Supports multiple scales, LAN deployment, private deployment, DB backup",
        "提升效率30%，降低人工成本，避免數據錯誤，實現可追溯管理",
        "Increase efficiency 30%, reduce labor cost, avoid errors, traceability",
        "食品加工|Food Processing,倉儲物流|Warehouse Logistics",
      ],
    ]
  );
  XLSX.utils.book_append_sheet(wb, ws5, "磅秤系統");

  // ========== Sheet 6: 系統功能 ==========
  const ws6 = createSheet(
    [
      "solution_slug(所屬系統標識)",
      "icon(圖標路徑)",
      "title_zh(功能標題-中文)",
      "title_en(功能標題-英文)",
      "desc_zh(功能描述-中文)",
      "desc_en(功能描述-英文)",
    ],
    [
      [
        "warehouse-system",
        "/assets/images/icons/auto-record.png",
        "自動記錄",
        "Auto Record",
        "自動保存每筆數據",
        "Automatically save each record",
      ],
      [
        "warehouse-system",
        "/assets/images/icons/erp.png",
        "ERP對接",
        "ERP Integration",
        "支持API對接主流ERP系統",
        "Supports API integration with mainstream ERP",
      ],
      [
        "warehouse-system",
        "/assets/images/icons/report.png",
        "報表統計",
        "Report Statistics",
        "自動生成日報、月報統計",
        "Auto-generate daily and monthly reports",
      ],
    ]
  );
  XLSX.utils.book_append_sheet(wb, ws6, "系統功能");

  // ========== Sheet 7: 案例資訊 ==========
  const ws7 = createSheet(
    [
      "slug(案例標識)",
      "title_zh(案例名稱-中文)",
      "title_en(案例名稱-英文)",
      "industry_slug(行業標識，如food/warehouse/mining)",
      "industry_zh(所屬行業-中文)",
      "industry_en(所屬行業-英文)",
      "system_used_zh(使用系統-中文)",
      "system_used_en(使用系統-英文)",
      "result_summary_zh(成果摘要-中文)",
      "result_summary_en(成果摘要-英文)",
      "background_zh(項目背景-中文)",
      "background_en(項目背景-英文)",
      "pain_points(客戶痛點，格式: 中文|英文，逗號分隔多條)",
      "solution_details(解決方案明細，格式: 中文|英文，逗號分隔多條)",
      "results(實施數據，格式: 數字|標籤中文|標籤英文，逗號分隔)",
      "result_detail_zh(實施效果總結-中文)",
      "result_detail_en(實施效果總結-英文)",
      "cover_image(封面圖路徑)",
      "gallery(圖片集，逗號分隔)",
    ],
    [
      [
        "food-factory",
        "某食品廠倉儲智能稱重系統項目",
        "Food Factory Smart Weighing Project",
        "food",
        "食品加工",
        "Food Processing",
        "智能倉儲稱重管理系統",
        "Smart Warehouse Weighing Management System",
        "提升稱重效率40%",
        "Efficiency increased 40%",
        "日均稱重200+批次，人工記錄",
        "200+ batches daily, manual recording",
        "手寫記錄容易出錯|Handwriting errors,無法即時生成統計報表|Unable to generate real-time reports,數據無法對接ERP|Data cannot integrate with ERP,稱重數據無法追溯|Weighing data not traceable",
        "部署5台XZ-3000平台秤|Deployed 5 XZ-3000 platform scales,對接客戶現有ERP系統|Integrated with customer's existing ERP,配備標籤打印機自動打印|Equipped with label printers,實施多用戶權限管理|Implemented multi-user permission management",
        "40%|稱重效率提升|Weighing efficiency increase,2人|人工成本降低|Labor cost reduced,90%|錯誤率降低|Error rate reduction",
        "項目實施後，稱重效率提升40%，減少2名記錄員，數據錯誤率降低90%",
        "After implementation, weighing efficiency increased 40%, reduced 2 recording staff, data error rate decreased 90%",
        "/assets/images/cases/food-factory/main.jpg",
        "/assets/images/cases/food-factory/1.jpg,/assets/images/cases/food-factory/2.jpg",
      ],
    ]
  );
  XLSX.utils.book_append_sheet(wb, ws7, "案例資訊");

  // Save
  XLSX.writeFile(wb, OUTPUT_PATH);
  console.log(`✅ Excel 模板已生成: ${OUTPUT_PATH}`);
  console.log("📝 請在模板中填寫數據（灰色行為示例數據，請替換為實際數據）");
  console.log("📦 填寫完成後運行 npm run gen:json 轉換為 JSON 文件");
}

main();
