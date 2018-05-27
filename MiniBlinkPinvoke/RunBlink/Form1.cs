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
            Timer timer1 = new Timer();
            timer1.Interval = 10000;
            timer1.Enabled = true;
            timer1.Tick += new EventHandler(timer1EventProcessor);//添加事件
        }

        public void timer1EventProcessor(object source, EventArgs e)
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://127.0.0.1:5000/ips");
                request.Method = "GET";
                request.Timeout = 10000;
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
                if (retString.Length <=0)
                {
                    return;
                }
                string[] sArray = retString.Split(':');
                wkeProxy proxy = new wkeProxy();
                proxy.type = wkeProxyType.WKE_PROXY_HTTP;
                proxy.hostname = sArray[0];
                proxy.port = ushort.Parse(sArray[1]);           
                BlinkBrowserPInvoke.wkeSetProxyWrap(proxy);
                BlinkBrowserPInvoke.wkeStopLoading(browserControl.handle);
                browserControl.Url = "http://www.hao123.com/?tn=90384165_hao_pg";
            }
            catch (Exception ex)
            {
                return;
            }
            
        }
    }
}
