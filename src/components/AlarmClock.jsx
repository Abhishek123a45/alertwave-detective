import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, PauseCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AlarmClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [snoozeTime, setSnoozeTime] = useState(5);
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkAlarms = () => {
      alarms.forEach(alarm => {
        if (!alarm.isRinging && isAlarmTime(alarm.time)) {
          triggerAlarm(alarm.id);
        }
      });
    };

    const alarmChecker = setInterval(checkAlarms, 1000);
    return () => clearInterval(alarmChecker);
  }, [alarms]);

  const isAlarmTime = (alarmTime) => {
    const [alarmHours, alarmMinutes] = alarmTime.split(':');
    const now = new Date();
    return now.getHours() === parseInt(alarmHours) && now.getMinutes() === parseInt(alarmMinutes);
  };

  const triggerAlarm = (alarmId) => {
    setAlarms(prevAlarms => prevAlarms.map(alarm => 
      alarm.id === alarmId ? { ...alarm, isRinging: true } : alarm
    ));
    if (audioRef.current) {
      audioRef.current.play();
    }
    toast.info(`Alarm ringing: ${alarms.find(a => a.id === alarmId).time}`);
  };

  const handleAddAlarm = () => {
    if (newAlarmTime) {
      const newAlarm = {
        id: Date.now(),
        time: newAlarmTime,
        isRinging: false,
      };
      setAlarms([...alarms, newAlarm]);
      setNewAlarmTime('');
      toast.success('Alarm added successfully!');
    } else {
      toast.error('Please set a valid alarm time.');
    }
  };

  const handleStopAlarm = (alarmId) => {
    setAlarms(prevAlarms => prevAlarms.map(alarm => 
      alarm.id === alarmId ? { ...alarm, isRinging: false } : alarm
    ));
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleSnooze = (alarmId) => {
    const alarm = alarms.find(a => a.id === alarmId);
    handleStopAlarm(alarmId);
    const snoozeDate = new Date(currentTime.getTime() + snoozeTime * 60000);
    const snoozeAlarm = {
      ...alarm,
      id: Date.now(),
      time: `${snoozeDate.getHours().toString().padStart(2, '0')}:${snoozeDate.getMinutes().toString().padStart(2, '0')}`,
      isRinging: false,
    };
    setAlarms([...alarms, snoozeAlarm]);
    toast.info(`Alarm snoozed for ${snoozeTime} minutes.`);
  };

  const handleDeleteAlarm = (alarmId) => {
    setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.id !== alarmId));
    toast.success('Alarm deleted successfully!');
  };

  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedAudio(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <h2 className="text-2xl font-bold">Alarm Clock</h2>
      <div className="text-4xl font-bold">
        {currentTime.toLocaleTimeString()}
      </div>
      <div className="w-full max-w-xs space-y-2">
        <Input
          type="time"
          value={newAlarmTime}
          onChange={(e) => setNewAlarmTime(e.target.value)}
          className="w-full"
        />
        <Button onClick={handleAddAlarm} className="w-full">
          <Bell className="mr-2 h-4 w-4" /> Add Alarm
        </Button>
      </div>
      <div className="w-full max-w-xs space-y-2">
        <label htmlFor="snooze-time" className="block text-sm font-medium text-gray-700">
          Snooze Time (minutes):
        </label>
        <Input
          type="number"
          id="snooze-time"
          value={snoozeTime}
          onChange={(e) => setSnoozeTime(Number(e.target.value))}
          min="1"
          className="w-full"
        />
      </div>
      <div className="w-full max-w-xs">
        <label htmlFor="audio-file" className="block text-sm font-medium text-gray-700 mb-1">
          Select Alarm Sound
        </label>
        <Input
          type="file"
          id="audio-file"
          accept="audio/*"
          onChange={handleAudioChange}
        />
      </div>
      <div className="w-full max-w-xs space-y-2">
        <h3 className="text-lg font-semibold">Alarms:</h3>
        {alarms.map(alarm => (
          <div key={alarm.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span>{alarm.time}</span>
            <div>
              {alarm.isRinging ? (
                <>
                  <Button onClick={() => handleStopAlarm(alarm.id)} variant="destructive" size="sm" className="mr-2">
                    <PauseCircle className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleSnooze(alarm.id)} variant="outline" size="sm">
                    Snooze
                  </Button>
                </>
              ) : (
                <Button onClick={() => handleDeleteAlarm(alarm.id)} variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <audio ref={audioRef} src={selectedAudio || '/default-alarm.mp3'} />
    </div>
  );
};

export default AlarmClock;