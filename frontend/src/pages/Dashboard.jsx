import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, isPositive, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="glass-panel p-6 rounded-2xl relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-blue-400">
        <Icon className="w-5 h-5" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
        isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
      }`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </div>
    </div>
    <div>
      <p className="text-zinc-400 text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">KasparAI Analytics</h1>
        <p className="text-zinc-400">Monitor your agent's performance and saved revenue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Saved Revenue" value="$42,504" change="+14.2%" isPositive={true} icon={TrendingUp} delay={0.1} />
        <StatCard title="Total Interventions" value="1,249" change="+5.4%" isPositive={true} icon={Users} delay={0.2} />
        <StatCard title="Conversion Lift" value="+8.4%" change="+1.2%" isPositive={true} icon={ShoppingBag} delay={0.3} />
        <StatCard title="Abandonment Rate" value="62.1%" change="-4.3%" isPositive={true} icon={BarChart3} delay={0.4} /> {/* Rate down is positive! */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mock Chart Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-panel p-6 rounded-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Revenue Recovered over Time</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-zinc-300 outline-none">
              <option>Last 30 Days</option>
              <option>This Week</option>
            </select>
          </div>
          
          {/* CSS-based Mock Chart Visualization */}
          <div className="h-[300px] w-full flex items-end justify-between items-stretch gap-2 pb-8 relative">
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-zinc-500 pt-2 border-t border-white/10">
              <span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span>
            </div>
            
            {[35, 45, 30, 60, 50, 75, 65, 80, 90, 85, 100, 95].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end group">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600/50 to-blue-400/80 rounded-t-sm relative transition-all group-hover:opacity-80"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ${height * 100}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel p-6 rounded-2xl flex flex-col"
        >
          <h3 className="text-lg font-bold mb-6">Top Interventions Triggered</h3>
          
          <div className="space-y-5 flex-1 w-full text-white">
            {[
              { reason: 'Price Sensitivity', action: 'Offered 5% Discount', pct: 45, color: 'bg-blue-500' },
              { reason: 'Shipping Cost', action: 'Offered Free Shipping', pct: 30, color: 'bg-purple-500' },
              { reason: 'Trust / Security', action: 'Displayed Trust Badges', pct: 15, color: 'bg-emerald-500' },
              { reason: 'Delivery Time', action: 'Showed Expedited Options', pct: 10, color: 'bg-amber-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-zinc-200">{item.reason}</span>
                  <span className="text-zinc-400">{item.pct}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 mb-1.5 overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                </div>
                <span className="text-xs text-zinc-500 font-mono">Action: {item.action}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
