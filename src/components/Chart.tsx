import { LineChart } from "@mui/x-charts";

// Define the FacilityPerformance type
interface FacilityPerformance {
  timestamps: string[];
  active_power_kWs: number[];
  energy_kWhs: number[];
}

// Define the props for the LineChart component
interface LineChartProps {
  data: FacilityPerformance;
}

const LineChartComponent: React.FC<LineChartProps> = ({ data }) => {
  // Transform timestamps into Date objects and prepare series data
  const xAxisData = data.timestamps.map((timestamp) => new Date(timestamp));

  return (
    <div>
      <LineChart
        xAxis={[
          {
            label: "Time",
            data: xAxisData,
            scaleType: "time",
          },
        ]}
        yAxis={[
          { label: "Active Power (kWs)", id: "leftAxisId" },
          { label: "Energy (kWhs)", id: "rightAxisId" },
        ]}
        series={[
          {
            label: "Active Power (kWs)",
            data: data.active_power_kWs,
            showMark: false,
            yAxisId: "leftAxisId",
          },
          {
            label: "Energy (kWhs)",
            data: data.energy_kWhs,
            showMark: false,
            yAxisId: "rightAxisId",
          },
        ]}
        rightAxis="rightAxisId"
        height={400}
      />
    </div>
  );
};

export default LineChartComponent;
