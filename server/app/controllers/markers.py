from flask import Blueprint, request, abort, jsonify
from ..data import markers as service, entities

bp = Blueprint("markers", __name__, url_prefix="/markers")


@bp.route("/")
def get_markers():
    return jsonify(service.get_markers())

@bp.route("/", methods=["POST"])
def add_marker():
    json = request.get_json(silent=True)
    if json is None:
        return abort(400)
    
    # validate input
    lat = json.get("lat")
    lng = json.get("lng")
    label = json.get("label")
    if not isinstance(lat, (float, int)) or not isinstance(lng, (float, int) or (label is not None or not isinstance(label, str))):
        return abort(400)
    
    service.add_marker(entities.Marker(lat, lng, label))
    
    return jsonify({})