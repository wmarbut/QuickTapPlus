#include <pebble.h>
#include "qt_config.h"
/*
* User settings
* Show Clock
* Show Weather
* Autohide
*/

#define QTP_SCREEN_WIDTH        144
#define QTP_SCREEN_HEIGHT       168

#define QTP_PADDING_Y 5
#define QTP_PADDING_X 5
#define QTP_BT_ICON_SIZE 32
#define QTP_BAT_ICON_SIZE 32
#define QTP_WEATHER_SIZE 32
#define QTP_TIME_HEIGHT 32
#define QTP_BATTERY_BASE_Y 0
#define QTP_BLUETOOTH_BASE_Y QTP_BAT_ICON_SIZE + 5
#define QTP_WEATHER_BASE_Y QTP_BAT_ICON_SIZE + QTP_BT_ICON_SIZE + 10



// Items
static int QTP_WINDOW_TIMEOUT = 2000;
static Window *qtp_window;
static bool qtp_is_showing;
static TextLayer *qtp_battery_text_layer;
static TextLayer *qtp_bluetooth_text_layer;
static TextLayer *qtp_time_layer;
static TextLayer *qtp_temp_layer;
static TextLayer *qtp_weather_desc_layer;
static AppTimer *qtp_hide_timer;
static GBitmap *qtp_bluetooth_image;
static GBitmap *qtp_weather_icon;
static BitmapLayer *qtp_bluetooth_image_layer;
static BitmapLayer *qtp_weather_icon_layer;
static GBitmap *qtp_battery_images[3];
static GBitmap *qtp_battery_image;
static BitmapLayer *qtp_battery_image_layer;
static InverterLayer *qtp_inverter_layer;
static int qtp_conf;
static bool qtp_bluetooth_status;

AppSync qtp_sync;
uint8_t qtp_sync_buffer[120];

enum qtp_weather_key {
	QTP_WEATHER_ICON_KEY = 0x0,         // TUPLE_INT
	QTP_WEATHER_TEMP_F_KEY = 0x1,  // TUPLE_CSTRING
	QTP_WEATHER_CITY_KEY = 0x2,         // TUPLE_CSTRING
	QTP_WEATHER_DESC_KEY = 0x3,         // TUPLE_CSTRING
	QTP_WEATHER_TEMP_C_KEY = 0x4 // TUPLE_CSTRING
};

static const int QTP_WEATHER_ICONS[] = {
	RESOURCE_ID_QTP_IMAGE_CLEAR_DAY, //0
	RESOURCE_ID_QTP_IMAGE_CLEAR_NIGHT, //1
	RESOURCE_ID_QTP_IMAGE_ATMOSPHERE_NIGHT, //2
	RESOURCE_ID_QTP_IMAGE_ATMOSPHERE_DAY, //3
	RESOURCE_ID_QTP_IMAGE_CLOUDY, //4
	RESOURCE_ID_QTP_IMAGE_THUNDERSTORM, //5
	RESOURCE_ID_QTP_IMAGE_RAIN, //6
	RESOURCE_ID_QTP_IMAGE_SNOW, //7
	RESOURCE_ID_QTP_IMAGE_NONE //8
};

static const int QTP_BATTERY_ICONS[] = {
	RESOURCE_ID_QTP_IMG_BATE,
	RESOURCE_ID_QTP_IMG_BATP,
	RESOURCE_ID_QTP_IMG_BAT
};


// Methods
void qtp_setup();
void qtp_app_deinit();

void qtp_show();
void qtp_hide();
void qtp_timeout();

void qtp_tap_handler(AccelAxisType axis, int32_t direction);
void qtp_click_config_provider(Window *window);
void qtp_back_click_responder(ClickRecognizerRef recognizer, void *context);

void qtp_setup_app_message();
static void qtp_sync_changed_callback(const uint32_t key, const Tuple* new_tuple, const Tuple* old_tuple, void* context);
static void qtp_sync_error_callback(DictionaryResult dict_error, AppMessageResult app_message_error, void *context);
void qtp_bluetooth_callback(bool connected);

void qtp_update_battery_status(bool mark_dirty);
void qtp_update_bluetooth_status(bool mark_dirty);
void qtp_update_time(bool mark_dirty);
void qtp_update_weather_icon(int icon_index, bool remove_old, bool mark_dirty);

void qtp_init();
void qtp_deinit();

// Helpers

void qtp_set_timeout(int timeout);
void qtp_init_bluetooth_status(bool status);

int qtp_battery_y();
int qtp_bluetooth_y();
int qtp_weather_y();


