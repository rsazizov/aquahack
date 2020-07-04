import requests
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.action_chains import ActionChains

url = "https://www.ventusky.com/?p=40.37;47.22;7&l=temperature-5cm"
url2 = "https://www.windy.com/ru/-%D0%A2%D0%B5%D0%BC%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D1%83%D1%80%D0%B0-temp?temp,40.290,48.483,8"


x = "40.380"
y = "47.675"

driver = webdriver.Chrome()
# driver.set_window_position(0,0)
# driver.set_window_size(2000, 2000)
driver.get("https://www.windy.com/" + x + "/" + y + "?temp,2020-07-13-12,40.470,47.642,8")

# elem = driver.find_element_by_id('q')

# print("----------------------------")
# print(elem)
# print("----------------------------")
# location = elem.location
# action = ActionChains(driver)
# action.move_to_element(elem)

# print(location)
# action.move_to_element(elem).move_by_offset(200, 200).click().perform

# print("----------------------------")

delay = 10 # seconds
myElem = WebDriverWait(driver, delay).until(EC.presence_of_element_located((By.ID, 'detail-data-table')))
print ("Page is ready!")


elem = driver.find_element_by_id("detail-data-table")
temps = driver.find_elements_by_xpath('//*[@id="detail-data-table"]/tbody/tr[4]/td')
# //*[@id="detail-data-table"]/tbody/tr[4]/td[1]
#detail-data-table > tbody > tr.td-temp.height-temp.d-display-table > td:nth-child(1)
#detail-data-table > tbody > tr.td-temp.height-temp.d-display-table > td:nth-child(6)
#detail-data-table > tbody > tr.td-temp.height-temp.d-display-table > td:nth-child(8)
# temps2 = driver.find_elements_by_class_name('height-temp')
print(temps)
# print(elem)
# print("!----------------------------!")
# print(temps)
i = 0
print("(----------------------------)")
for el in temps:
	print("!----------------------------!")
	print(el)
	i += 1
print(i)

# for el in temps2:
# 	print("!!----------------------------!!")
# 	print(el)