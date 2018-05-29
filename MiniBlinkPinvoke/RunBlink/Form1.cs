using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using MiniBlinkPinvoke;
namespace RunBlink
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            //browserControl.GlobalObjectJs = this;
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            browserControl.Url = "http://www.hao123.com/?tn=90384165_hao_pg";
            //BlinkBrowserPInvoke.wkeSetHeadlessEnabled(browserControl.handle, true);
            Timer timer1 = new Timer();
            timer1.Interval = 7000;
            timer1.Enabled = true;
            timer1.Tick += new EventHandler(timer1EventProcessor);

            //_wkeConsoleMessageCallback = OnwkeConsoleMessageCallback;
            //BlinkBrowserPInvoke.wkeOnConsole(browserControl.handle, _wkeConsoleMessageCallback, IntPtr.Zero);
            RunTimer();
        }

        public void timer1EventProcessor(object source, EventArgs e)
        {
            RunTimer();
        }

        public void RunTimer()
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://127.0.0.1:5000/ips");
                request.Method = "GET";
                request.Timeout = 7000;
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                Stream myResponseStream = response.GetResponseStream();
                StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.GetEncoding("utf-8"));
                string retString = myStreamReader.ReadToEnd();
                myStreamReader.Close();
                myResponseStream.Close();
                //browserControl

                if (browserControl.handle == IntPtr.Zero)
                {
                    return;
                }

                Console.WriteLine(retString);
                if (retString.Length <= 0)
                {
                    return;
                }
                string[] sArray = retString.Split(':');
                wkeProxy proxy = new wkeProxy
                {
                    type = wkeProxyType.WKE_PROXY_HTTP,
                    hostname = sArray[0],
                    port = ushort.Parse(sArray[1])
                };
                BlinkBrowserPInvoke.wkeSetViewProxyWrap(browserControl.handle, proxy);
                BlinkBrowserPInvoke.wkeStopLoading(browserControl.handle);
                browserControl.Url = "http://www.hao123.com/?tn=90384165_hao_pg";
                //BlinkBrowserPInvoke.wkeLoadURLW(browserControl.handle, "http://www.hao123.com/?tn=90384165_hao_pg");
            }
            catch (WebException ex)
            {
                Console.WriteLine(ex.StackTrace);
                //runTimer();
                return;
            } 
            catch (Exception ex)
            {
                return;
            }
        }

        wkeConsoleMessageCallback _wkeConsoleMessageCallback;
        void OnwkeConsoleMessageCallback(IntPtr webView, IntPtr param, wkeConsoleLevel level, IntPtr message, IntPtr sourceName, int sourceLine, IntPtr stackTrace)
        {
            //Console.WriteLine("My Console :" + level);
            string consoleStr = BlinkBrowserPInvoke.wkeGetString(message).Utf8IntptrToString();
            Console.WriteLine("Console Msg:" + BlinkBrowserPInvoke.wkeGetString(message).Utf8IntptrToString());
            /*if (consoleStr.IndexOf("创造酷炫hao123") >= 0)
            {
                runTimer();
            }*/
            Console.WriteLine("Console Msg:" + BlinkBrowserPInvoke.wkeGetString(message).Utf8IntptrToString());
            //Console.WriteLine("Console sourceName:" + wkeGetString(sourceName).Utf8IntptrToString());
            //Console.WriteLine("Console stackTrace:" + wkeGetString(stackTrace).Utf8IntptrToString());
            //Console.WriteLine("Console sourceLine:" + sourceLine);
        }
    }
}
