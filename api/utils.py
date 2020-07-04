import requests
import urllib

# USGS Elevation Point Query Service
url = r'https://nationalmap.gov/epqs/pqs.php?'

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
