//wx
const wxready = 'wxready';
const mytimestamp = 1494331792;
const mynonceStr = '727be54e-145a-4705-8a45-44be381f02c8';
//bt
const btoff = 'btoff';
const btopen = 'btopen';
const btconnecting = 'btconnecting';
//device
const deviceconnected = 'connected';
const devicedisconnected = 'disconnected';
const deviceconnecting = 'connecting';
const devicenone = 'devicenone';
const deviceconnecterror = 'connecterror';

//wifi
const wifi = 'wifi';

//ip
const deviceipback = 'deviceip';
const localipback = 'localip';


const testCode = "*#test";
const btnClickSoundID = "click";

const apiPath = "api_path";

const urlMode = "mode";
const debug = "debug";


const appId = "app_id";


const deviceFileManagerConnected = 'connected';
const deviceFileManagerDisconnected = 'disconnected';
const deviceFileManagerinit = 'init'

const sure = 'sure';
const cancel = 'cancel';

//Frame
const FRAME_BT = 'BT';
const FRAME_WIFI = 'WIFI';
const FRAME_AIRPLAY = 'AIRPLAY';
const FRAME_WIRELESS_STORE = 'FRAME_WIRELESS_STORE';
const FRAME_CONTROLLER = 'CONTROLLER';
const FRAME_WIFI_HISTORY = 'WIFIHISTORY';
const FRAME_WIFI_SETTING = 'WIFISETTING';


const MODULE_TV_CONTROLLER = 'tvcontroller';
const MODULE_SYNC_DISPLAY = 'sync_display';
const MODULE_WIRELESS_STORE = 'wireless_store';
const MODULE_WIFI_SETTINGS = 'wifi_settings';

//Wifi Setting Event Type,
const EVENT_WIFI_BASE = 100;
const EVENT_WIFI_LSIT = "" + EVENT_WIFI_BASE + 1;
const EVENT_WIFI_CONNECTED = "" + EVENT_WIFI_BASE + 2;
const EVENT_WIFI_DISCONNECTED = "" + EVENT_WIFI_BASE + 3;
const EVENT_WIFI_HISTORY_LSIT = "" + EVENT_WIFI_BASE + 4;

//ip check event type,
const EVENT_IP_BASE = 150;
const EVENT_IP_RES = "" + EVENT_IP_BASE + 1;
const EVENT_IP_PING_SUCCESS = "" + EVENT_IP_BASE + 2;
const EVENT_IP_PING_FAIL = "" + EVENT_IP_BASE + 3;
const EVENT_IP_REQ = "" + EVENT_IP_BASE + 4;



//project bt witch phone connected event type;
const EVENT_PROJECT_BT_BASE = 200;
const EVENT_PROJECT_BT_CONNECTED = "" + EVENT_PROJECT_BT_BASE + 1;
const EVENT_PROJECT_BT_DISCONNECTED = "" + EVENT_PROJECT_BT_BASE + 2;
///project device   event
const EVENT_DEVICE = 250;
const EVENT_DEVICE_INFO = "" + EVENT_DEVICE + 1;

//controller edit focus change
const EVENT_EDIT_FOCUS_CHANGE = 'edit_focus_change';

//module status check
const BT_STATUS_OK = 0x001;
const WIFI_STATUS_OK = 0x010;
const DEVICE_IN_ROOM_OK = 0x100;

// const TV_CONTROLLER_CHECK = BT_STATUS_OK;
const TV_CONTROLLER_CHECK = BT_STATUS_OK | WIFI_STATUS_OK | DEVICE_IN_ROOM_OK;;
const WIRELESS_STORE_CHECK = BT_STATUS_OK | WIFI_STATUS_OK | DEVICE_IN_ROOM_OK;
const SYNC_DISPLAY_CHECK = BT_STATUS_OK | WIFI_STATUS_OK | DEVICE_IN_ROOM_OK;
// const PROJECTOR_WIFI_SETTING_CHECK = BT_STATUS_OK | WIFI_STATUS_OK;
const PROJECTOR_WIFI_SETTING_CHECK = BT_STATUS_OK ;

const airPlaydownLoadUrl = "http://a.app.qq.com/o/simple.jsp?pkgname=com.hpplay.happycast";
