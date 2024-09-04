import React from 'react';
import { Button } from "@/components/ui/button";
import { PauseCircle, Trash2 } from 'lucide-react';

const AlarmList = ({ alarms, onStopAlarm, onSnooze, onDeleteAlarm }) => {
  return (
    <div className="w-full max-w-xs space-y-2">
      <h3 className="text-lg font-semibold">Alarms:</h3>
      {alarms.map(alarm => (
        <div key={alarm.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
          <span>{alarm.time}</span>
          <div>
            {alarm.isRinging ? (
              <>
                <Button onClick={() => onStopAlarm(alarm.id)} variant="destructive" size="sm" className="mr-2">
                  <PauseCircle className="h-4 w-4" />
                </Button>
                <Button onClick={() => onSnooze(alarm.id)} variant="outline" size="sm">
                  Snooze
                </Button>
              </>
            ) : (
              <Button onClick={() => onDeleteAlarm(alarm.id)} variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlarmList;