def validate_campaign_body(body):
    required = ['name', 'client', 'platform', 'budget', 'units']
    for field in required:
        if field not in body:
            return False, f"Missing field: {field}"
    try:
        budget = float(body['budget'])
        units = float(body['units'])
    except (ValueError, TypeError):
        return False, "budget and units must be numeric"
    if units <= 0:
        return False, "units must be > 0"
    if budget < 0:
        return False, "budget must be >= 0"
    return True, ""
