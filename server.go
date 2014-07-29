package main
//Quest and Users must have one element in their arrays if you are trying to add or update
import (
	"fmt"
	"os"
	"io/ioutil"
	//"log"
	//"time"
	
	"net/http"
	//"io"
	"github.com/gorilla/websocket"

	//"database/sql"
	//"github.com/lib/pq"
	//"github.com/jmoiron/sqlx"

	//"strings"
	//"strconv"
	//"reflect"

	//"encoding/json"

	//"github.com/jgleesawn/ECC_Conn"
)


func main() {

	fmt.Println("listening...")
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
 	}
	http.HandleFunc("/",webHandler)
	http.HandleFunc("/data.js",data)
	http.HandleFunc("/script.js",jsscript)
	http.HandleFunc("/glMatrix-0.9.5.min.js",glMatrix)
	err := http.ListenAndServe(":"+port,nil)
	if err != nil {
		panic(err)
	}
}
func webHandler(res http.ResponseWriter, req *http.Request){
	//url := `onelyfe.herokuapp.com`
	//url = req.Host
	html_arr, err := ioutil.ReadFile("index.html")
	if err != nil {
		fmt.Fprintln(res,[]byte("Error loading page."))
	}
	fmt.Fprintln(res,string(html_arr))
	//js_arr, err := ioutil.ReadFile("script.js")
	//if err != nil {
//		fmt.Fprintln(res,[]byte("Error loading page."))
//	}
//	arr := strings.Split(string(html_arr),`</script>`)

	//fmt.Println(arr)
	//fmt.Println(len(arr))
	//fmt.Println(len(arr[0]))
	//fmt.Println(strings.Join(arr,`</script>`))

	//arr[0] = strings.Join([]string{arr[0],string(js_arr)},``)
	//fmt.Fprintln(res, strings.Join(arr,`</script>`))
}
func data(res http.ResponseWriter, req *http.Request) {
	js_arr, err := ioutil.ReadFile("data.js")
	if err != nil {
		fmt.Fprintln(res,[]byte("Error loading page."))
	}
	fmt.Fprintln(res, string(js_arr))
}
func jsscript(res http.ResponseWriter, req *http.Request) {
	js_arr, err := ioutil.ReadFile("script.js")
	if err != nil {
		fmt.Fprintln(res,[]byte("Error loading page."))
	}
	fmt.Fprintln(res, string(js_arr))
}
func glMatrix(res http.ResponseWriter, req *http.Request) {
	js_arr, err := ioutil.ReadFile("glMatrix-0.9.5.min.js")
	if err != nil {
		fmt.Fprintln(res,[]byte("Error loading page."))
	}
	fmt.Fprintln(res, string(js_arr))
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}
type wsinterface interface {
//int is websocket.messageType
	WriteMessage(int,[]byte)(error)
	ReadMessage()(int,[]byte,error)
}
type noencWs struct {
	wsinterface
	PacketSize	int
	PayloadLen	int
}
func (x *noencWs) Write(p []byte) (n int, err error){
	start := 0
	end := len(p)
	if end > x.PayloadLen {
		end = x.PayloadLen
	}
	for end < len(p) {
		err = x.WriteMessage(websocket.BinaryMessage,p[start:end])
		if err != nil {
			return start,err
		}
		start = end
		end += x.PayloadLen
	}
	err = x.WriteMessage(websocket.BinaryMessage,p[start:len(p)])
	if err != nil {
		return start,err
	}
	return len(p),err
}
func (x *noencWs) Read(p []byte) (n int, err error){
	_,data,err := x.ReadMessage()
	l := len(data)
	copy(p[:l],data)
	return l,err
}

