require 'highline/import'

colors = HighLine::ColorScheme.new do |cs|
	cs[:code] = [:green, :on_black]
end
HighLine.color_scheme = colors


class QTPlusConfiguration
	attr_accessor :options_enabled
	attr_reader :options

	def initialize
		@options = [
			{
				description: "Autohide the window",
				question: "Autohide the window? ",
				value: "QTP_K_AUTOHIDE",
				default: true,
				type: 'yn'
			},
			{
				description: "Show clock",
				question: "Show clock?",
				value: "QTP_K_SHOW_TIME",
				default: true,
				type: 'yn'
			},
			{
				description: "Show weather",
				question: "Show weather using PebbleKit.js?",
				value: "QTP_K_SHOW_WEATHER",
				default: true,
				type: 'yn'
			},
			{
				description: "Use Fahrenheit for temperatures",
				question: "Use Fahrenheit for temperatures?",
				value: "QTP_K_DEGREES_F",
				default: false,
				type: 'yn'
			},
			{
				description: "Use black one white?",
				question: "Show black on white?",
				value: "QTP_K_INVERT",
				default: false,
				type: 'yn'
			},
			{
				description: "Subscribe to bluetooth",
				question: "Subscribe to bluetooth? If you don't, you must call the callback yourself.",
				value: "QTP_K_SUBSCRIBE",
				default: true,
				type: 'yn'
			},
			{
				description: "Vibrate on bluetooth loss and regain",
				question: "Vibrate on bluetooth status change",
				value: "QTP_K_VIBRATE",
				default: false,
				type: 'yn'
			},
			{
				description: "Window display length in milliseconds",
				question: "How long should the window be shown? ",
				value: "qtp_set_timeout",
				default: 2000,
				type: 'func',
				user_val: ''
			}
		]
		@options_enabled = []
	end

	def buildOptions
		str = "\n// Configure QT+\nqtp_set_config("
		val_str = ""
		func_str = ""

		@options_enabled.each_with_index do |option,index|
			if option[:type] == 'yn'
				str += "\n\t"
				if index > 0
					str += " | "
				end
				str += option[:value] + "\t/* " + option[:description] + "*/"
			elsif option[:type] == 'func'
				func_str += "\n#{option[:value]}(#{option[:user_val]}); /* #{option[:description]} */"
			else
				val_str += "\n#{option[:value]} = #{option[:user_val]}; /* #{option[:description]} */"
			end
		end
		str += ");\n" + val_str + func_str
		str
	end
end

yn = Proc.new  do |str|
	if str == 'Yes' or str == 'yes' or str == 'y' or str == 'No' or str == 'no' or str == 'n'
		true
	else
		false
	end
end

yn_converter = Proc.new do |str|
	if str == 'Yes' or str == 'yes' or str == 'y' 
		true
	elsif str == 'No' or str == 'no' or str == 'n'
		false
	end
end

conf = QTPlusConfiguration.new

puts "\e[H\e[2J"
puts <<EOD
CONFIGURATION

This tool will help you write the configuration for QT+. Descriptions of each configuration item 
can be found in the Readme file.

EOD

conf.options.each do |option|
	if option[:type] == 'yn'
		default = 'yes' if option[:default] 
		default = 'no' unless option[:default] 
		val = ask(option[:question] + "(y/n) ", yn_converter) {|q| q.validate = yn; q.default = default;}
		if val
			conf.options_enabled.push option
		end
	else
		option[:user_val] = ask(option[:question], Integer) {|q| q.default = option[:default] }
		conf.options_enabled.push option
	end
end

str_config = conf.buildOptions
say "\n<%= color('YOUR CONFIGURATION', :bold) %>\n<%= color('#{str_config}', :code) %>\n\n"

should_write = ask("Would you like to write this to src/qt_config.h? ", yn_converter) {|q| q.default = 'yes'; q.validate = yn;}


if should_write
	File.open(File.join(File.expand_path(File.join(File.dirname(__FILE__), '..')), 'src' , "qt_config.h"), 'w') do |f|
		f.write str_config
	end
	say "Configuration written..."
end
