import requests
import urllib

# USGS Elevation Point Query Service
url = r'https://nationalmap.gov/epqs/pqs.php?'

def lookup_water_price(lat, lon):
  # TODO:
  return 0.2

def lookup_crop_k(name):
  crop_coefficients = [
    {"name": "garlic", "initial": 0.8, "middle" : 1.25, "end": 0.7},
    {"name": "onion", "initial": 0.7, "middle" : 1.05, "end": 0.95},
    {"name": "tomato", "initial": 0.7, "middle" : 1.05, "end": 0.8},
    {"name": "corn", "initial": 0.3, "middle" : 1.15, "end": 0.4},
    {"name": "cucumber","initial": 0.6, "middle" : 1, "end": 0.75},
    {"name": "carrots", "initial": 0.7, "middle" : 1.05, "end": 0.95},
    {"name": "potato", "initial": 0.5, "middle" : 1.15, "end": 0.75},
    {"name": "spring wheat", "initial": 0.23, "middle" : 1.16, "end": 0.4},
    {"name": "cereal", "initial": 0.3, "middle" : 1.15, "end": 0.25},
    {"name": "olive", "initial": 0.65, "middle" : 0.45, "end": 0.65},
    {"name": "grape wine", "initial": 0.3, "middle" : 0.7, "end": 0.45},
    {"name": "grape raisin",  "initial": 0.3, "middle" : 0.85, "end": 0.45}
  ] 

  return tuple(filter(lambda s: s['name'].lower() == name.lower(), crop_coefficients))[0]['middle']

def elevation(lon, lat):
  """Query service using lat, lon. add the elevation values as a new column."""

  params = {
    'output': 'json',
    'x': lon,
    'y': lat,
    'units': 'Meters'
  }

  result = requests.get((url + urllib.parse.urlencode(params)))
  return result.json()['USGS_Elevation_Point_Query_Service']['Elevation_Query']['Elevation']
