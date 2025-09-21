"use client";

import { BarChart2, TrendingUp, Calendar, Target } from "lucide-react";
import { Card } from "@/components/card";
import { TrendAnalyzer } from "@/components/trend-analyzer";

export function PredictionView() {
  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-accent">Prediction</h1>
        <p className="text-foreground/80">Trend analysis and forecasting</p>
      </div>

      <div className="space-y-8">
        {/* Main Trend Analyzer */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="text-secondary" size={24} />
            <h2 className="text-2xl font-bold text-secondary">
              Trend Analysis Engine
            </h2>
          </div>
          <TrendAnalyzer />
        </div>

        {/* Additional Prediction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Market Trends Card */}
          <Card className="bg-blue-50/50 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-blue-600" size={24} />
              <h3 className="text-lg font-bold text-foreground">Market Trends</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Cotton Demand</span>
                <span className="text-sm font-medium text-green-600">+12% ↗</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Silk Prices</span>
                <span className="text-sm font-medium text-red-600">-5% ↘</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/70">Linen Popularity</span>
                <span className="text-sm font-medium text-green-600">+8% ↗</span>
              </div>
            </div>
          </Card>

          {/* Seasonal Forecast Card */}
          <Card className="bg-green-50/50 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-green-600" size={24} />
              <h3 className="text-lg font-bold text-foreground">Seasonal Forecast</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-green-100/50 rounded-lg">
                <div className="text-sm font-medium text-foreground">Spring 2025</div>
                <div className="text-xs text-foreground/70">High demand for light fabrics</div>
              </div>
              <div className="p-3 bg-orange-100/50 rounded-lg">
                <div className="text-sm font-medium text-foreground">Summer 2025</div>
                <div className="text-xs text-foreground/70">Cotton and linen peak season</div>
              </div>
            </div>
          </Card>

          {/* Production Goals Card */}
          <Card className="bg-purple-50/50 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-purple-600" size={24} />
              <h3 className="text-lg font-bold text-foreground">Production Goals</h3>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">15</div>
                <div className="text-sm text-foreground/70">Projects this month</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="text-center text-sm text-foreground/70">75% complete</div>
            </div>
          </Card>
        </div>

        {/* Detailed Analytics Section */}
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">Detailed Analytics</h3>
            <div className="text-center py-8 text-foreground/60">
              <BarChart2 size={48} className="mx-auto mb-4 text-foreground/40" />
              <p>Advanced analytics and predictions will be displayed here</p>
              <p className="text-sm mt-2">This section will show detailed trend analysis, market predictions, and production forecasting tools.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

