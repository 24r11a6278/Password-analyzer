/* data.js
   Static reference data used by the analyzer:
   - COMMON_PASSWORDS: sample of known leaked/weak passwords
   - KEYBOARD_ROWS: real keyboard rows, used to detect keyboard-walk patterns
   - LEET_MAP: leetspeak substitution map, used to "de-leet" a password
*/

const COMMON_PASSWORDS = new Set([
"123456","123456789","qwerty","password","12345","qwerty123","1q2w3e","12345678",
"111111","1234567890","1234567","123123","abc123","iloveyou","1234","1q2w3e4r5t",
"qwertyuiop","monkey","dragon","123321","letmein","master","welcome","football",
"princess","admin","solo","login","starwars","freedom","whatever","qazwsx",
"trustno1","batman","zaq1zaq1","superman","hello","charlie","aa123456","donald",
"password1","password123","qwerty1","1qaz2wsx","654321","666666","sunshine",
"mynoob","ashley","bailey","passw0rd","shadow","121212","michael","jennifer",
"jordan","hunter","hunter2","buster","soccer","harley","ranger","computer",
"michelle","jessica","pepper","daniel","access","flower","corvette","tigger",
"mustang","cheese","amanda","summer","love","ginger","hockey","george","andrew",
"joshua","tennis","jester","gemini","hammer","taylor","anthony","cookie","banana",
"orange","cowboy","thunder","dallas","robert","samantha","maggie","viking",
"guitar","marine","chicken","purple","andrea","phoenix","mickey","bigdog",
"secret","asdfgh","asdf","zxcvbn","zxcvbnm","1111","0000","11111111","22222222",
"iloveu","forever","baseball","basketball","matrix","biteme","killer","aaaa",
"trouble","scooter","scooby","angel","spider","patrick","testing","cool",
"chocolate","water","apple123","apple","google","facebook","instagram",
"admin123","root","toor","changeme","temp","temp123","guest","default",
"letmein123","welcome123","qwerty12345","1a2b3c4d","abcd1234","a1b2c3",
"passw0rd1","p@ssword","p@ssw0rd","q1w2e3r4","987654321","159753","147258369",
"7777777","8675309","iloveyou1","iloveyou2","princess1","sunshine1","football1",
"baseball1","12345678910","000000","1122334455","qwe123","asdf1234"
]);

const KEYBOARD_ROWS = ["qwertyuiop","asdfghjkl","zxcvbnm","1234567890","!@#$%^&*()"];

const LEET_MAP = {'@':'a','4':'a','0':'o','3':'e','1':'i','!':'i','$':'s','5':'s','7':'t'};
