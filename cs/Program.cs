using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Runtime.InteropServices;
using System.Diagnostics;
using Win32;

namespace RunChrome
{
    class Program
    {
        [DllImport("user32.dll")]
        static extern IntPtr WindowFromPoint(int xPoint, int yPoint);

        [DllImport("user32.dll", SetLastError = true)]
        public static extern IntPtr FindWindowEx(IntPtr parentHandle, IntPtr childAfter, string ClassName, IntPtr WindowTitle);

        [DllImport("user32.dll")]
        public static extern IntPtr FindWindow(String sClassName, String sAppName);

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = false)]
        static extern IntPtr SendMessage(IntPtr hWnd, int Msg, int wParam, int lParam);

        [DllImport("user32.dll", SetLastError = true)]
        static extern bool PostMessage(IntPtr hWnd, uint Msg, int wParam, int lParam);

        [DllImport("user32.dll")]
        public static extern int SetActiveWindow(IntPtr hWnd);

        [DllImport("user32.dll")]
        public static extern int SetForegroundWindow(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern int GetWindowtext(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

        [DllImport("user32.dll", SetLastError = true)]
        public static extern IntPtr GetWindow(IntPtr hWnd, GetWindow_Cmd uCmd);

        [DllImport("User32")]
        public extern static void mouse_event(int dwFlags, int dx, int dy, int dwData, IntPtr dwExtraInfo);

        [DllImport("User32")]
        public extern static void SetCursorPos(int x, int y);

        [DllImport("user32.dll", EntryPoint = "ShowWindow", SetLastError = true)]
        static extern bool ShowWindow(IntPtr hWnd, uint nCmdShow);

        public enum GetWindow_Cmd : uint
        {
            GW_HWNDFIRST = 0,
            GW_HWNDLAST = 1,
            GW_HWNDNEXT = 2,
            GW_HWNDPREV = 3,
            GW_OWNER = 4,
            GW_CHILD = 5,
            GW_ENABLEDPOPUP = 6
        }

        const int WM_KEYDOWN = 0x100;
        const int WM_KEYUP = 0x101;
        const int VK_BROWSER_BACK = 0x6A;
        const int VK_BROWSER_FORWARD = 0x69;

        const int VK_CONTROL = 0x11;
        const int VK_TAB = 0x09;

        public enum WMessages : int
        {
            WM_LBUTTONDOWN = 0x201, //Left mousebutton down
            WM_LBUTTONUP = 0x202, //Left mousebutton up
            WM_RBUTTONDOWN = 0x204, //Right mousebutton down
            WM_RBUTTONUP = 0x205, //Right mousebutton up
            WM_MOUSEWHEEL = 0x020A,
        }

        [DllImport("user32.dll")]
        private static extern int GetWindowRect(IntPtr hwnd, out Rect lpRect);

        public struct Rect
        {
            public int Left;
            public int Top;
            public int Right;
            public int Bottom;
        }

        public static int MakeLParam(int LoWord, int HiWord)
        {
            return ((HiWord << 16) | (LoWord & 0xffff));
        }

        public static int LowWord(int val)
        {
            return (int)val;
        }

        public static int HighWord(int val)
        {
            return (int)(val >> 16);
        }

        public static int MakeWParam(int low, int high)
        {
            return ((int)high << 16) | (int)low;
        }

        public void ControlClickWindow(string wndName, int x, int y)
        {
            IntPtr hWnd = FindWindow(null, "");
            SetForegroundWindow(hWnd);

            // Cursor.Position = new Point(90, 110);

            int LParam = MakeLParam(x, y);

            SendMessage(hWnd, (int)WMessages.WM_LBUTTONDOWN, 0, LParam);
            SendMessage(hWnd, (int)WMessages.WM_LBUTTONUP, 0, LParam);
        }


        public static void ClickWindow(IntPtr handle)
        {
            Rect rect = new Rect();
            GetWindowRect(handle, out rect);

            Random random = new Random();
            var r = rect;
            var width = rect.Right - rect.Left;
            var height = rect.Bottom - rect.Top;
            int x = width / 2 + random.Next(-width / 3, width / 3);
            int y = height / 2 + random.Next(-height / 3, height / 3); ;
            int LParam = MakeLParam(x, y);

            SendMessage(handle, (int)WMessages.WM_LBUTTONDOWN, 0, LParam);
            SendMessage(handle, (int)WMessages.WM_LBUTTONUP, 0, LParam);
        }

        public static void Run()
        {
            while(true)
            {
                Thread.Sleep(4000);
                try
                {
                    List<WindowInformation> windowListExtended = WindowList.GetAllWindowsExtendedInfo();
                    foreach (var wi in windowListExtended)
                    {
                        if (wi.Class.Equals("Chrome_WidgetWin_1"))
                        {
                            //SetForegroundWindow(wi.Handle);

                            int LParam = MakeLParam(40, 34);
                            SendMessage(wi.Handle, (int)WMessages.WM_LBUTTONDOWN, 0, LParam);
                            SendMessage(wi.Handle, (int)WMessages.WM_LBUTTONUP, 0, LParam);

                            if (wi.ChildWindowHandles.Count > 0)
                            {
                                ClickWindow(wi.ChildWindowHandles[0]);
                            }

                            LParam = MakeLParam(80, 34);
                            SendMessage(wi.Handle, (int)WMessages.WM_LBUTTONDOWN, 0, LParam);
                            SendMessage(wi.Handle, (int)WMessages.WM_LBUTTONUP, 0, LParam);

                            if (wi.ChildWindowHandles.Count > 0)
                            {
                                ClickWindow(wi.ChildWindowHandles[0]);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.StackTrace);
                }
            }
        }

        static void Main(string[] args)
        {
            Thread mythread = new Thread(Run);
            mythread.Start();


            for (var i = 1; i < 16; i++)
            {
                Process.Start("C:\\work\\Chrome" + i.ToString() + "\\chrome" + i.ToString() + ".exe");
                //Process.Start("C:\\work\\RunBlink" + i.ToString() + "\\RunBlink" + i.ToString() + ".exe");
                Thread.Sleep(1000);
            }

            while (true)
            {
                Thread.Sleep(300000);

                for (var i = 1; i < 16; i++)
                {
                    var cps = Process.GetProcessesByName("Chrome" + i.ToString());
                    foreach (var cp in cps)
                    {
                        try
                        {
                            //cp.CloseMainWindow();
                            cp.Kill();
                        }
                        catch(Exception ex)
                        {
                            Console.WriteLine(ex.StackTrace);
                        }
                        
                        //cp.CloseMainWindow();

                    }
                    //Process.Start("C:\\work\\RunBlink" + i.ToString() + "\\RunBlink" + i.ToString() + ".exe");
                    string sourceFile = @"c:\work\Secure Preferences";
                    string destinationFile = "C:\\work\\Chrome" + i.ToString() + "\\User Data\\Default\\Secure Preferences";
                    bool isrewrite = true; // true=覆盖已存在的同名文件,false则反之
                    System.IO.File.Copy(sourceFile, destinationFile, isrewrite);
                    Process.Start("C:\\work\\Chrome" + i.ToString() + "\\chrome" + i.ToString() + ".exe");
                    Thread.Sleep(1000); 
                }
            }
        }
    }
}
