require 'watir-webdriver'
b = Watir::Browser.new :chrome
width = b.execute_script('return screen.width;')
height = b.execute_script('return screen.height;')
b.driver.manage.window.move_to(0,0)
b.driver.manage.window.resize_to(width,height)
b.goto 'http://datalab/bacteria/bacteria.html?name=Acidaminococcus_intestini_RyC_MR95&view=ALL'
sleep 3
s = b.select_list :id => 'bacteria-selector'
opts = s.options.map(&:text)

opts.each do |option|
	s.select_value(option)
	sleep 3
	b.screenshot.save option + '.png'
end