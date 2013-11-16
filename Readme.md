# What is Quick Tap Plus

An *easy* way to add weather, battery, and bluetooth pairing info to any watchface without screwing up the aesthetics. It is designed to be configurable and a drop-in addition. This is for Pebble 2.0 only.

Have a look for yourself.

![Pebble White](http://i.imgur.com/Pz4ZRLS.png)
![Pebble Black](http://i.imgur.com/8OeSKHs.png)

# Credit where credit is do, license, etc

Quick Tap Plus is licensed under the [*Attribution-NonCommercial-ShareAlike 3.0 Unported*](http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US). If you have something different in mind, reach out. 

Weather icons are from [Alessio Atzeni](http://www.alessioatzeni.com/meteocons/) and are called "Meteocons". 

Battery icon is from the [Pyconic](http://www.pyconic.com/) free set. 

Bluetooth icon is from [Flaticons](http://flaticons.net/customize.php?dir=Network%20and%20Security&icon=Bluetooth.png).

Examples for the Pebble team are greatly appreciated, you can find the [dev site](https://developer.getpebble.com).

# What can I configure?

1. *QTP_K_SHOW_TIME* The clock at the top is shown if this is enabled
+ *QTP_K_SHOW_WEATHER* Weather at the bottom is if this enabled
+ *QTP_K_AUTOHIDE* Automatically hide the app shade after 2 seconds if this is enabled
+ *QTP_K_DEGREES_F* Use farenheit if enabled, otherwise celcisus is used
+ *QTP_K_INVERT* White background unless enabled

# How do I use it?

I set it up to be as easy as possible to install and use.

## appinfo.json

Copy the array items from `resources.json` into your `appinfo.json` under the `resources.media`.

## Images

Copy the `resources/images` into your `resources/images`.

## Code

1. Copy the `QTPlus.h` and `QTPlus.c` into your `src`.
+ Copy the `js` into your src if you are planning on using weather. Do not copy the `js` if you are not going to use javascript. 
+ Add `#include "QTPlus.h"` 
+ Add your configuration options if any
  e.g. `qtp_conf = QTP_K_SHOW_TIME | QTP_K_SHOW_WEATHER | QTP_K_AUTOHIDE | QTP_K_DEGREES_F | QTP_K_INVERT;` 
+ Add `qtp_setup();` before your `app_event_loop()` call.
+ Add `qtp_app_deinit();` wherever you peform your deinit operations 
