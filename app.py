import streamlit as st
from datetime import datetime

st.set_page_config(
    page_title="Cafe & Restaurant Order System",
    page_icon="🍽️",
    layout="wide",
)

# ── Styling ──────────────────────────────────────────────────────────────────
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        padding: 20px 30px;
        border-radius: 12px;
        margin-bottom: 20px;
        text-align: center;
    }
    .main-header h1 { color: #e8c068; margin: 0; font-size: 2rem; }
    .main-header p  { color: #a0aec0; margin: 4px 0 0 0; font-size: 0.95rem; }

    .table-card {
        background: #1e293b;
        border: 2px solid #334155;
        border-radius: 10px;
        padding: 12px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
    }
    .table-card:hover { border-color: #e8c068; }
    .table-card.active { border-color: #e8c068; background: #2d3748; }

    .menu-item-card {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 8px;
    }

    .order-summary {
        background: #1e293b;
        border: 1px solid #e8c068;
        border-radius: 12px;
        padding: 20px;
    }

    .bill-row {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        border-bottom: 1px solid #334155;
    }
    .bill-total {
        font-size: 1.2rem;
        font-weight: bold;
        color: #e8c068;
    }

    .stButton > button {
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.2s;
    }

    div[data-testid="metric-container"] {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 8px;
        padding: 12px;
    }
</style>
""", unsafe_allow_html=True)

# ── Menu Data ─────────────────────────────────────────────────────────────────
MENU = {
    "🥗 Starters": [
        {"name": "Garden Salad",        "price": 6.50},
        {"name": "Tomato Soup",         "price": 5.00},
        {"name": "Garlic Bread",        "price": 4.00},
        {"name": "Bruschetta",          "price": 7.00},
        {"name": "Chicken Wings",       "price": 9.50},
        {"name": "Calamari",            "price": 10.00},
    ],
    "🍽️ Main Course": [
        {"name": "Grilled Chicken",     "price": 16.00},
        {"name": "Beef Steak (250g)",   "price": 28.00},
        {"name": "Grilled Salmon",      "price": 22.00},
        {"name": "Pasta Carbonara",     "price": 14.00},
        {"name": "Margherita Pizza",    "price": 13.00},
        {"name": "Lamb Chops",          "price": 26.00},
        {"name": "Veggie Burger",       "price": 12.00},
        {"name": "Fish & Chips",        "price": 15.00},
    ],
    "🍰 Desserts": [
        {"name": "Chocolate Lava Cake", "price": 8.00},
        {"name": "Crème Brûlée",        "price": 7.50},
        {"name": "Tiramisu",            "price": 7.00},
        {"name": "Vanilla Ice Cream",   "price": 5.00},
        {"name": "Cheesecake",          "price": 7.50},
        {"name": "Fruit Tart",          "price": 6.50},
    ],
    "☕ Hot Beverages": [
        {"name": "Espresso",            "price": 3.00},
        {"name": "Cappuccino",          "price": 4.00},
        {"name": "Latte",               "price": 4.50},
        {"name": "Tea",                 "price": 2.50},
        {"name": "Hot Chocolate",       "price": 4.00},
    ],
    "🥤 Cold Beverages": [
        {"name": "Fresh Orange Juice",  "price": 4.50},
        {"name": "Lemonade",            "price": 3.50},
        {"name": "Mineral Water",       "price": 2.00},
        {"name": "Soft Drink (Can)",    "price": 2.50},
        {"name": "Milkshake",           "price": 5.50},
        {"name": "Iced Tea",            "price": 3.50},
    ],
    "🍷 Alcohol": [
        {"name": "House Wine (Glass)",  "price": 7.00},
        {"name": "House Wine (Bottle)", "price": 28.00},
        {"name": "Craft Beer (Pint)",   "price": 6.00},
        {"name": "Imported Beer",       "price": 5.50},
        {"name": "Gin & Tonic",         "price": 9.00},
        {"name": "Cocktail of the Day", "price": 11.00},
    ],
}

NUM_TABLES = 20

# ── Session State ─────────────────────────────────────────────────────────────
def init_state():
    if "orders" not in st.session_state:
        # orders[table_no] = list of {name, price, qty}
        st.session_state.orders = {t: [] for t in range(1, NUM_TABLES + 1)}
    if "active_table" not in st.session_state:
        st.session_state.active_table = 1
    if "vat_pct" not in st.session_state:
        st.session_state.vat_pct = 14.0
    if "service_pct" not in st.session_state:
        st.session_state.service_pct = 12.0
    if "active_category" not in st.session_state:
        st.session_state.active_category = list(MENU.keys())[0]

init_state()

def add_item(table, item):
    order = st.session_state.orders[table]
    for entry in order:
        if entry["name"] == item["name"]:
            entry["qty"] += 1
            return
    order.append({"name": item["name"], "price": item["price"], "qty": 1})

def remove_item(table, item_name):
    order = st.session_state.orders[table]
    for i, entry in enumerate(order):
        if entry["name"] == item_name:
            if entry["qty"] > 1:
                entry["qty"] -= 1
            else:
                order.pop(i)
            return

def clear_table(table):
    st.session_state.orders[table] = []

def table_item_count(table):
    return sum(e["qty"] for e in st.session_state.orders[table])

def compute_bill(table, vat_pct, service_pct):
    order = st.session_state.orders[table]
    subtotal   = sum(e["price"] * e["qty"] for e in order)
    vat        = subtotal * vat_pct / 100
    service    = subtotal * service_pct / 100
    total      = subtotal + vat + service
    return subtotal, vat, service, total

# ── Header ────────────────────────────────────────────────────────────────────
st.markdown("""
<div class="main-header">
    <h1>🍽️ Cafe & Restaurant Order System</h1>
    <p>Manage table orders with ease</p>
</div>
""", unsafe_allow_html=True)

# ── Sidebar Settings ──────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### ⚙️ Settings")
    st.session_state.vat_pct = st.number_input(
        "VAT %", min_value=0.0, max_value=50.0,
        value=st.session_state.vat_pct, step=0.5, format="%.1f"
    )
    st.session_state.service_pct = st.number_input(
        "Service Charge %", min_value=0.0, max_value=30.0,
        value=st.session_state.service_pct, step=0.5, format="%.1f"
    )

    st.divider()
    st.markdown("### 📊 Quick Overview")
    occupied = [t for t in range(1, NUM_TABLES + 1) if table_item_count(t) > 0]
    st.metric("Tables Occupied", f"{len(occupied)} / {NUM_TABLES}")

    if occupied:
        st.markdown("**Active Tables:**")
        for t in occupied:
            cnt = table_item_count(t)
            _, _, _, total = compute_bill(t, st.session_state.vat_pct, st.session_state.service_pct)
            st.markdown(f"- Table {t}: {cnt} items · **${total:.2f}**")

# ── Table Grid ────────────────────────────────────────────────────────────────
st.markdown("### 🪑 Select Table")

cols = st.columns(10)
for idx, table_no in enumerate(range(1, NUM_TABLES + 1)):
    col = cols[idx % 10]
    count = table_item_count(table_no)
    is_active = table_no == st.session_state.active_table
    label = f"**T{table_no}**" + (f"\n{count} items" if count else "\nEmpty")
    btn_type = "primary" if is_active else "secondary"
    with col:
        if st.button(label, key=f"tbl_{table_no}", type=btn_type, use_container_width=True):
            st.session_state.active_table = table_no

table = st.session_state.active_table
st.markdown(f"### 📋 Table {table} — Order")

# ── Main Content: Menu + Order ────────────────────────────────────────────────
left_col, right_col = st.columns([3, 2], gap="large")

with left_col:
    st.markdown("#### Menu")
    cat_cols = st.columns(len(MENU))
    for i, cat in enumerate(MENU.keys()):
        with cat_cols[i]:
            if st.button(cat, key=f"cat_{cat}",
                         type="primary" if cat == st.session_state.active_category else "secondary",
                         use_container_width=True):
                st.session_state.active_category = cat

    st.markdown(f"**{st.session_state.active_category}**")
    items = MENU[st.session_state.active_category]
    item_cols = st.columns(2)
    for j, item in enumerate(items):
        with item_cols[j % 2]:
            with st.container(border=True):
                c1, c2 = st.columns([3, 1])
                with c1:
                    st.markdown(f"**{item['name']}**")
                    st.markdown(f"${item['price']:.2f}")
                with c2:
                    if st.button("＋", key=f"add_{table}_{item['name']}", use_container_width=True):
                        add_item(table, item)
                        st.rerun()

with right_col:
    st.markdown("#### Order Summary")
    order = st.session_state.orders[table]

    if not order:
        st.info("No items added yet. Select items from the menu.")
    else:
        with st.container(border=True):
            for entry in order:
                r1, r2, r3, r4 = st.columns([4, 1, 2, 1])
                with r1:
                    st.markdown(f"**{entry['name']}**")
                with r2:
                    st.markdown(f"×{entry['qty']}")
                with r3:
                    line_total = entry["price"] * entry["qty"]
                    st.markdown(f"**${line_total:.2f}**")
                with r4:
                    if st.button("−", key=f"rm_{table}_{entry['name']}", use_container_width=True):
                        remove_item(table, entry["name"])
                        st.rerun()

        # Bill breakdown
        subtotal, vat, service, total = compute_bill(
            table, st.session_state.vat_pct, st.session_state.service_pct
        )

        st.markdown("---")
        bill_rows = [
            ("Subtotal",                                              subtotal),
            (f"VAT ({st.session_state.vat_pct:.1f}%)",              vat),
            (f"Service ({st.session_state.service_pct:.1f}%)",       service),
        ]
        for label, amount in bill_rows:
            c1, c2 = st.columns([3, 1])
            c1.markdown(label)
            c2.markdown(f"**${amount:.2f}**")

        st.markdown("---")
        tc1, tc2 = st.columns([3, 1])
        tc1.markdown("### **TOTAL**")
        tc2.markdown(f"### **${total:.2f}**")

        st.markdown("")
        # Print receipt area
        with st.expander("🧾 Print / View Receipt"):
            now = datetime.now().strftime("%Y-%m-%d  %H:%M")
            receipt_lines = [
                "=" * 38,
                "     CAFE & RESTAURANT",
                "=" * 38,
                f"  Table No: {table}",
                f"  Date:     {now}",
                "-" * 38,
                f"  {'ITEM':<22} {'QTY':>3} {'PRICE':>8}",
                "-" * 38,
            ]
            for entry in order:
                line_total = entry["price"] * entry["qty"]
                receipt_lines.append(
                    f"  {entry['name']:<22} {entry['qty']:>3} ${line_total:>7.2f}"
                )
            vat_label     = f"VAT ({st.session_state.vat_pct:.1f}%)"
            service_label = f"Service ({st.session_state.service_pct:.1f}%)"
            receipt_lines += [
                "-" * 38,
                f"  {'Subtotal':<26} ${subtotal:>7.2f}",
                f"  {vat_label:<26} ${vat:>7.2f}",
                f"  {service_label:<26} ${service:>7.2f}",
                "=" * 38,
                f"  {'TOTAL':<26} ${total:>7.2f}",
                "=" * 38,
                "     Thank you for dining with us!",
                "=" * 38,
            ]
            st.code("\n".join(receipt_lines), language=None)

        st.markdown("")
        if st.button("🗑️ Clear Table Order", type="secondary", use_container_width=True):
            clear_table(table)
            st.rerun()
