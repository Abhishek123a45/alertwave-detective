import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import AlarmList from './AlarmList';
import AlarmForm from './AlarmForm';

const AlarmClock = ({ initialOffsetTime }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState([]);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [snoozeTime, setSnoozeTime] = useState(5);
  const [timeOffset, setTimeOffset] = useState(initialOffsetTime || 5);
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
      audioRef.current.loop = true;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        toast.error('Failed to play alarm sound. Please check your audio settings.');
      });
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

  const handleAddOffsetAlarm = () => {
    const newAlarmDate = new Date(currentTime.getTime() + timeOffset * 60000);
    const newAlarmTime = `${newAlarmDate.getHours().toString().padStart(2, '0')}:${newAlarmDate.getMinutes().toString().padStart(2, '0')}`;
    const newAlarm = {
      id: Date.now(),
      time: newAlarmTime,
      isRinging: false,
    };
    setAlarms([...alarms, newAlarm]);
    toast.success(`Alarm added for ${newAlarmTime}`);
  };

  const handleStopAlarm = (alarmId) => {
    setAlarms(prevAlarms => prevAlarms.map(alarm => 
      alarm.id === alarmId ? { ...alarm, isRinging: false } : alarm
    ));
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.loop = false;
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
    setAlarms(prevAlarms => [...prevAlarms.filter(a => a.id !== alarmId), snoozeAlarm]);
    toast.info(`Alarm snoozed for ${snoozeTime} minutes.`);
  };

  const handleDeleteAlarm = (alarmId) => {
    setAlarms(prevAlarms => prevAlarms.filter(alarm => alarm.id !== alarmId));
    handleStopAlarm(alarmId);
    toast.success('Alarm deleted successfully!');
  };

  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setSelectedAudio(audioUrl);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
      }
      toast.success('Alarm sound updated successfully!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <h2 className="text-2xl font-bold">Alarm Clock</h2>
      <div className="text-4xl font-bold">
        {currentTime.toLocaleTimeString()}
      </div>
      <AlarmForm
        newAlarmTime={newAlarmTime}
        onNewAlarmTimeChange={setNewAlarmTime}
        onAddAlarm={handleAddAlarm}
        timeOffset={timeOffset}
        onTimeOffsetChange={setTimeOffset}
        onAddOffsetAlarm={handleAddOffsetAlarm}
      />
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
      <AlarmList
        alarms={alarms}
        onStopAlarm={handleStopAlarm}
        onSnooze={handleSnooze}
        onDeleteAlarm={handleDeleteAlarm}
      />
      <audio ref={audioRef} src={selectedAudio || '/default-alarm.mp3'} />
    </div>
  );
};

export default AlarmClock;