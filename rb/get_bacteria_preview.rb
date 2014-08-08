require 'watir-webdriver'
b = Watir::Browser.new :chrome
width = b.execute_script('return screen.width;')
height = b.execute_script('return screen.height;')
b.driver.manage.window.move_to(0,0)
b.driver.manage.window.resize_to(width,height)
b.goto 'http://datalab/bacteria/bacteria.html?name=Akkermansia_muciniphila_ATCC_BAA_835&view=ALL'
sleep 5
s = b.select_list :id => 'bacteria-selector'
opts = s.options.map(&:text)

opts.each do |option|
	s.select_value(option)
	sleep 10
	b.screenshot.save 'ALL/' + option + '.png'
end

b.goto 'http://datalab/bacteria/bacteria.html?name=Akkermansia_muciniphila_ATCC_BAA_835&view=CHN'
sleep 5

opts.each do |option|
	s.select_value(option)
	sleep 10
	b.screenshot.save 'CHN/' + option + '.png'
end

b.goto 'http://datalab/bacteria/bacteria.html?name=Akkermansia_muciniphila_ATCC_BAA_835&view=EUR'
sleep 5

opts.each do |option|
	s.select_value(option)
	sleep 10
	b.screenshot.save 'EUR/' + option + '.png'
end

b.goto 'http://datalab/bacteria/bacteria.html?name=Akkermansia_muciniphila_ATCC_BAA_835&view=RUS'
sleep 5

opts.each do |option|
	s.select_value(option)
	sleep 10
	b.screenshot.save 'RUS/' + option + '.png'
end

b.goto 'http://datalab/bacteria/bacteria.html?name=Akkermansia_muciniphila_ATCC_BAA_835&view=USA'
sleep 5

opts.each do |option|
	s.select_value(option)
	sleep 10
	b.screenshot.save 'USA/' + option + '.png'
end