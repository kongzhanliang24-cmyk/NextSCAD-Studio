"""
導出輔助函數：封裝 STEP / STL / DXF 導出，統一輸出到 exports/ 目錄。
"""

import datetime
from pathlib import Path

import cadquery as cq

from src.config import STL_TOLERANCE, STL_ANGULAR_TOLERANCE

# 項目根目錄 / exports
_EXPORT_DIR = Path(__file__).resolve().parent.parent.parent / "exports"


def _ensure_dir() -> Path:
    """確保 exports 目錄存在。"""
    _EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    return _EXPORT_DIR


def _timestamped_name(base_name: str, ext: str) -> str:
    """生成帶時間戳的文件名，例如 bracket_20260408_133000.step"""
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"{base_name}_{ts}.{ext}"


def export_step(
    body: cq.Workplane,
    name: str = "part",
    timestamp: bool = True,
) -> Path:
    """
    導出 STEP 文件。

    Parameters
    ----------
    body : CadQuery 工作平面對象
    name : 文件基礎名稱
    timestamp : 是否在文件名中添加時間戳

    Returns
    -------
    Path : 導出文件的完整路徑
    """
    out_dir = _ensure_dir()
    fname = _timestamped_name(name, "step") if timestamp else f"{name}.step"
    path = out_dir / fname
    cq.exporters.export(body, str(path), exportType="STEP")
    print(f"[EXPORT] STEP -> {path}")
    return path


def export_stl(
    body: cq.Workplane,
    name: str = "part",
    timestamp: bool = True,
    tolerance: float = STL_TOLERANCE,
    angular_tolerance: float = STL_ANGULAR_TOLERANCE,
) -> Path:
    """
    導出 STL 文件。

    Parameters
    ----------
    body : CadQuery 工作平面對象
    name : 文件基礎名稱
    timestamp : 是否在文件名中添加時間戳
    tolerance : 線性公差
    angular_tolerance : 角度公差

    Returns
    -------
    Path : 導出文件的完整路徑
    """
    out_dir = _ensure_dir()
    fname = _timestamped_name(name, "stl") if timestamp else f"{name}.stl"
    path = out_dir / fname
    cq.exporters.export(
        body,
        str(path),
        exportType="STL",
        tolerance=tolerance,
        angularTolerance=angular_tolerance,
    )
    print(f"[EXPORT] STL -> {path}")
    return path


def export_dxf(
    body: cq.Workplane,
    name: str = "part",
    timestamp: bool = True,
) -> Path:
    """
    導出 DXF 文件（取頂面投影）。

    Parameters
    ----------
    body : CadQuery 工作平面對象
    name : 文件基礎名稱
    timestamp : 是否在文件名中添加時間戳

    Returns
    -------
    Path : 導出文件的完整路徑
    """
    out_dir = _ensure_dir()
    fname = _timestamped_name(name, "dxf") if timestamp else f"{name}.dxf"
    path = out_dir / fname
    cq.exporters.export(body, str(path), exportType="DXF")
    print(f"[EXPORT] DXF -> {path}")
    return path


def export_all(
    body: cq.Workplane,
    name: str = "part",
    formats: tuple = ("step", "stl"),
    timestamp: bool = True,
) -> list:
    """
    批量導出多種格式。

    Parameters
    ----------
    body : CadQuery 工作平面對象
    name : 文件基礎名稱
    formats : 要導出的格式元組，可選 "step", "stl", "dxf"
    timestamp : 是否在文件名中添加時間戳

    Returns
    -------
    list[Path] : 所有導出文件路徑
    """
    dispatch = {
        "step": export_step,
        "stl": export_stl,
        "dxf": export_dxf,
    }
    paths = []
    for fmt in formats:
        fn = dispatch.get(fmt.lower())
        if fn:
            paths.append(fn(body, name=name, timestamp=timestamp))
        else:
            print(f"[EXPORT] 不支持的格式: {fmt}")
    return paths
