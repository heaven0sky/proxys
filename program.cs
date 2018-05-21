using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Runtime.InteropServices;
using System.Diagnostics;

namespace RunChrome
{
    class Program
    {
        static void Main(string[] args)
        {
            for (var i = 1; i < 12; i++)
            {
                Process.Start("C:\\work\\Chrome" + i.ToString() + "\\chrome" + i.ToString() + ".exe");
                Thread.Sleep(5000);
            }
            while (true)
            {
                Thread.Sleep(300000);

                for (var i = 1; i < 12; i++)
                {
                    var cps = Process.GetProcessesByName("chrome" + i.ToString());
                    foreach (var cp in cps)
                    {
                        cp.Kill();
                    }
                    Thread.Sleep(5000);
                    Process.Start("C:\\work\\Chrome" + i.ToString() + "\\chrome" + i.ToString() + ".exe");
                }

            }

        }
    }
}
