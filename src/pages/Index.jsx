import AccelerometerAlarm from '../components/AccelerometerAlarm';
import AlarmClock from '../components/AlarmClock';

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Welcome to AlertWave Detective</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Accelerometer Monitor</h2>
          <AccelerometerAlarm />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Alarm Clock</h2>
          <AlarmClock />
        </div>
      </div>
    </div>
  );
};

export default Index;