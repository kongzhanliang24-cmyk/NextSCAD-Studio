import cadquery as cq

from src.parts.instrument_common import (
    make_db9_connector,
    make_power_jack,
    make_rj45_port,
)


PRINTER_W = 200.0
PRINTER_D = 251.0
PRINTER_H = 164.0

LOWER_SEAM_FRONT = 83.5
LOWER_SEAM_BACK = 75.5
UPPER_SEAM_FRONT = 84.3
UPPER_SEAM_BACK = 76.3

TOP_FRONT = 138.0
TOP_BACK = 146.0
TOP_PEAK = 164.0

BODY_COLOR = cq.Color(0.48, 0.48, 0.48, 1.0)
TRIM_COLOR = cq.Color(0.40, 0.40, 0.40, 1.0)
PANEL_COLOR = cq.Color("gray70")
RUBBER_COLOR = cq.Color("gray20")
WINDOW_COLOR = cq.Color(0.82, 0.85, 0.9, 0.7)
BADGE_COLOR = cq.Color(0.2, 0.2, 0.2, 1.0)
ENERGY_BADGE_COLOR = cq.Color(0.15, 0.55, 0.9, 1.0)
LABEL_COLOR = cq.Color(0.93, 0.93, 0.9, 1.0)
ROLLER_COLOR = cq.Color("gray70")
FASTENER_COLOR = cq.Color("gray55")


def _box(w: float, d: float, h: float, x: float = 0.0, y: float = 0.0, z: float = 0.0) -> cq.Workplane:
    return cq.Workplane("XY").box(w, d, h).translate((x, y, z))


def _extrude_side_profile(points: list[tuple[float, float]]) -> cq.Workplane:
    return cq.Workplane("YZ").polyline(points).close().extrude(PRINTER_W).translate((-PRINTER_W / 2, 0, 0))


def _rotate_to_back(obj: cq.Workplane) -> cq.Workplane:
    return obj.rotate((0, 0, 0), (1, 0, 0), -90)


def _place_on_back(obj: cq.Workplane, x: float, surface_y: float, z: float) -> cq.Workplane:
    return _rotate_to_back(obj).translate((x, surface_y, z))


def _cylinder_x(dia: float, length: float, x: float, y: float, z: float) -> cq.Workplane:
    return cq.Workplane("YZ").circle(dia / 2).extrude(length).translate((x - length / 2, y, z))


def _make_power_switch() -> dict:
    hole = (
        cq.Workplane("XY")
        .box(21.0, 12.0, 10.0, centered=(True, True, False))
        .translate((0, 0, -10.0))
    )
    bezel = cq.Workplane("XY").box(24.0, 15.0, 2.0, centered=(True, True, False))
    rocker = (
        cq.Workplane("XY")
        .box(18.0, 10.0, 2.2, centered=(True, True, False))
        .rotate((0, 0, 0), (1, 0, 0), -8)
        .translate((0, 0, 0.3))
    )
    return {
        "hole": hole,
        "parts": {
            "switch_bezel": (bezel, "gray10"),
            "switch_rocker": (rocker, "gray5"),
        },
    }


def _make_usb_b_port() -> dict:
    pts = [
        (-4.4, -4.0),
        (4.4, -4.0),
        (4.4, 2.0),
        (3.0, 4.2),
        (-3.0, 4.2),
        (-4.4, 2.0),
    ]
    pts_outer = [
        (-5.2, -4.8),
        (5.2, -4.8),
        (5.2, 2.6),
        (3.8, 4.8),
        (-3.8, 4.8),
        (-5.2, 2.6),
    ]
    hole = cq.Workplane("XY").polyline(pts).close().extrude(-10.0)
    shell = cq.Workplane("XY").polyline(pts_outer).close().extrude(1.2)
    insert = (
        cq.Workplane("XY")
        .polyline(pts)
        .close()
        .extrude(5.0)
        .translate((0, 0, -5.0))
    )
    return {
        "hole": hole,
        "parts": {
            "usb_b_shell": (shell, "gray70"),
            "usb_b_insert": (insert, "gray15"),
        },
    }


def _make_slot_array(
    x_center: float,
    y_center: float,
    cols: int,
    rows: int,
    pitch_x: float,
    pitch_y: float,
    slot_w: float,
    slot_d: float,
    slot_h: float,
) -> cq.Workplane | None:
    result = None
    x0 = x_center - (cols - 1) * pitch_x / 2
    y0 = y_center - (rows - 1) * pitch_y / 2
    for ix in range(cols):
        for iy in range(rows):
            slot = _box(
                slot_w,
                slot_d,
                slot_h,
                x0 + ix * pitch_x,
                y0 + iy * pitch_y,
                2.5,
            )
            result = slot if result is None else result.union(slot)
    return result


def _make_lower_body() -> cq.Workplane:
    lower = _extrude_side_profile(
        [
            (-PRINTER_D / 2, 0.0),
            (-PRINTER_D / 2, LOWER_SEAM_FRONT - 2.0),
            (-92.0, 81.0),
            (-48.0, 84.0),
            (18.0, 81.5),
            (78.0, 77.5),
            (PRINTER_D / 2, LOWER_SEAM_BACK - 1.0),
            (PRINTER_D / 2, 0.0),
        ]
    )
    lower = lower.edges("|X").fillet(3.8)

    rear_recess = _box(172.0, 10.0, 30.0, 0.0, PRINTER_D / 2 - 5.0, 28.0)
    front_slot = _box(150.0, 24.0, 12.0, 0.0, -PRINTER_D / 2 + 10.5, 94.0)
    left_front_relief = _box(14.0, 14.0, 34.0, -83.0, -PRINTER_D / 2 + 7.0, 43.0)
    right_front_relief = _box(14.0, 14.0, 34.0, 83.0, -PRINTER_D / 2 + 7.0, 43.0)
    left_latch_slot = _box(4.0, 7.0, 13.0, -69.0, -PRINTER_D / 2 + 4.5, 39.0)
    right_latch_slot = _box(4.0, 7.0, 13.0, 69.0, -PRINTER_D / 2 + 4.5, 39.0)
    service_panel_recess = _box(84.0, 110.0, 1.0, 18.0, 18.0, 0.5)

    lower = (
        lower
        .cut(rear_recess)
        .cut(front_slot)
        .cut(left_front_relief)
        .cut(right_front_relief)
        .cut(left_latch_slot)
        .cut(right_latch_slot)
        .cut(service_panel_recess)
    )

    left_vents = _make_slot_array(-27.0, 7.0, 4, 12, 7.0, 7.8, 4.0, 2.0, 5.0)

    if left_vents is not None:
        lower = lower.cut(left_vents)

    return lower


def _make_top_cover() -> cq.Workplane:
    cover = _extrude_side_profile(
        [
            (-PRINTER_D / 2, UPPER_SEAM_FRONT),
            (-PRINTER_D / 2, TOP_FRONT - 2.0),
            (-94.0, 145.0),
            (-58.0, 154.0),
            (-8.0, 161.5),
            (36.0, 163.0),
            (82.0, 156.0),
            (PRINTER_D / 2, TOP_BACK - 1.5),
            (PRINTER_D / 2, UPPER_SEAM_BACK),
        ]
    )
    cover = cover.edges("|X").fillet(7.0)

    rear_opening = _box(154.0, 29.0, 22.0, 0.0, PRINTER_D / 2 - 10.5, 95.0)
    cover = cover.cut(rear_opening)
    return cover


def _make_front_door() -> cq.Workplane:
    door = _box(146.0, 12.0, 46.0, 0.0, -PRINTER_D / 2 + 10.5, 39.0)
    inset = _box(132.0, 2.4, 32.0, 0.0, -PRINTER_D / 2 + 5.7, 38.0)
    door = door.cut(inset)
    door = door.edges("|Z").fillet(1.8)
    return door


def _make_indicator_window() -> cq.Workplane:
    return (
        _box(4.5, 10.0, 6.0, -92.0, -96.5, 136.5)
        .rotate((0.0, -96.5, 136.5), (1.0, -96.5, 136.5), -12)
    )


def _make_badges() -> list[tuple[cq.Workplane, cq.Color, str]]:
    brand = _box(45.0, 1.2, 15.0, 46.0, -PRINTER_D / 2 - 0.4, 118.0)
    energy = _box(16.0, 1.2, 18.0, 60.0, -PRINTER_D / 2 - 0.4, 102.0)
    return [
        (brand, BADGE_COLOR, "brand_badge"),
        (energy, ENERGY_BADGE_COLOR, "energy_star_badge"),
    ]


def _make_tear_bar() -> cq.Workplane:
    return _box(152.0, 1.2, 1.2, 0.0, -PRINTER_D / 2 + 0.8, 86.0)


def _make_output_roller() -> cq.Workplane:
    return _cylinder_x(1.6, 146.0, 0.0, -PRINTER_D / 2 + 5.8, 86.6)


def _make_side_buttons() -> list[cq.Workplane]:
    left = (
        cq.Workplane("YZ")
        .circle(6.5)
        .extrude(-3.5)
        .translate((-PRINTER_W / 2, -82.0, 80.0))
    )
    right = (
        cq.Workplane("YZ")
        .circle(6.5)
        .extrude(3.5)
        .translate((PRINTER_W / 2, -82.0, 80.0))
    )
    return [left, right]


def _make_feet() -> list[cq.Workplane]:
    positions = [
        (-82.0, -100.0),
        (82.0, -100.0),
        (-82.0, 100.0),
        (82.0, 100.0),
    ]
    feet = []
    for x, y in positions:
        feet.append(
            cq.Workplane("XY")
            .circle(9.0)
            .extrude(-3.0)
            .translate((x, y, 0.0))
        )
    return feet


def _make_bottom_label() -> cq.Workplane:
    return _box(74.0, 52.0, 0.8, -6.0, 69.0, 0.4)


def _make_bottom_service_panel() -> cq.Workplane:
    panel = _box(84.0, 110.0, 1.0, 18.0, 18.0, 0.5)
    vents = _make_slot_array(21.0, 18.0, 5, 9, 7.0, 8.0, 4.2, 2.0, 5.0)
    if vents is not None:
        panel = panel.cut(vents)
    tab = _box(16.0, 6.0, 2.4, 18.0, 74.0, 1.2)
    return panel.union(tab)


def _make_bottom_screws() -> list[cq.Workplane]:
    positions = [
        (-74.0, -72.0),
        (74.0, -72.0),
        (-73.0, 74.0),
        (73.0, 74.0),
    ]
    screws = []
    for x, y in positions:
        screws.append(
            cq.Workplane("XY")
            .circle(2.4)
            .extrude(-1.8)
            .translate((x, y, 0.0))
        )
    return screws


def _make_rear_label() -> cq.Workplane:
    return _box(49.0, 1.0, 8.0, 52.0, PRINTER_D / 2 - 4.4, 39.0)


def _build_back_panel() -> tuple[cq.Workplane, list[tuple[cq.Workplane, str, str]]]:
    panel_t = 1.5
    panel_w = 168.0
    panel_h = 24.0
    surface_y = PRINTER_D / 2 - 6.0
    panel = _box(panel_w, panel_t, panel_h, 0.0, surface_y - panel_t / 2, 28.5)
    left_hole = _place_on_back(cq.Workplane("XY").circle(2.4).extrude(-10.0), -80.0, surface_y, 22.0)
    panel = panel.cut(left_hole)

    visible_parts: list[tuple[cq.Workplane, str, str]] = []
    ports = [
        (_make_power_switch(), -59.0, 28.0, "power_switch"),
        (make_power_jack(), -31.0, 28.0, "dc_in"),
        (_make_usb_b_port(), -4.0, 28.0, "usb_b"),
        (make_db9_connector(), 36.0, 28.0, "db9"),
        (make_rj45_port(), 73.0, 28.0, "rj45"),
    ]

    for port_dict, x, z, prefix in ports:
        panel = panel.cut(_place_on_back(port_dict["hole"], x, surface_y, z))
        for part_name, (part, color) in port_dict["parts"].items():
            visible_parts.append(
                (_place_on_back(part, x, surface_y, z), color, f"{prefix}_{part_name}")
            )

    return panel, visible_parts


def make_label_printer() -> cq.Assembly:
    assy = cq.Assembly(name="label_printer")

    lower_body = _make_lower_body()
    top_cover = _make_top_cover()
    front_door = _make_front_door()
    back_panel, port_parts = _build_back_panel()

    assy.add(lower_body, name="lower_body", color=BODY_COLOR)
    assy.add(top_cover, name="top_cover", color=BODY_COLOR)
    assy.add(front_door, name="front_door", color=TRIM_COLOR)
    assy.add(_make_tear_bar(), name="tear_bar", color=cq.Color("gray60"))
    assy.add(_make_output_roller(), name="output_roller", color=ROLLER_COLOR)
    assy.add(_make_indicator_window(), name="indicator_window", color=WINDOW_COLOR)
    assy.add(back_panel, name="rear_io_panel", color=PANEL_COLOR)
    assy.add(_make_bottom_label(), name="bottom_label", color=LABEL_COLOR)
    assy.add(_make_bottom_service_panel(), name="bottom_service_panel", color=TRIM_COLOR)
    assy.add(_make_rear_label(), name="rear_label", color=LABEL_COLOR)

    for idx, foot in enumerate(_make_feet()):
        assy.add(foot, name=f"foot_{idx}", color=RUBBER_COLOR)

    for idx, screw in enumerate(_make_bottom_screws()):
        assy.add(screw, name=f"bottom_screw_{idx}", color=FASTENER_COLOR)

    for idx, button in enumerate(_make_side_buttons()):
        assy.add(button, name=f"side_button_{idx}", color=TRIM_COLOR)

    for part, color, name in port_parts:
        assy.add(part, name=name, color=cq.Color(color))

    for badge, color, name in _make_badges():
        assy.add(badge, name=name, color=color)

    return assy
