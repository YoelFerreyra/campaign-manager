def calculate_margin(budget, units):
    try:
        return float(budget) / float(units) if float(units) != 0 else 0.0
    except Exception:
        return 0.0
