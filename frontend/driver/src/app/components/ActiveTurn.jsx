import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Users, Clock, Navigation, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
















export function ActiveTurn({ turnTime, passengers, onEndTurn }) {
  const [isEnding, setIsEnding] = useState(false);

  const handleEndTurn = () => {
    setIsEnding(true);
    setTimeout(() => {
      onEndTurn();
    }, 800);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-primary/20 shadow-2xl shadow-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-3xl font-bold text-foreground">
            Active Turn
          </CardTitle>
        </div>
        <CardDescription className="text-muted-foreground flex items-center gap-2 mt-2">
          <Clock className="w-4 h-4" />
          {turnTime}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-5">


        {/* Passengers Subtitle */}
        <h4 className="text-lg font-bold text-gray-900 mt-4">Passengers</h4>

        {/* Passenger list */}
        <ScrollArea className="h-[340px] pr-4">
          <div className="space-y-3">
            {passengers.map((passenger, index) =>
            <motion.div
              key={passenger.passengerId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-primary/5 border border-primary/30 rounded-full p-4 px-6 flex items-center justify-between transition-all">
              
                <div className="flex items-center gap-4">
                  <p className="font-bold text-gray-900">
                    {passenger.name}
                  </p>
                  <span className="text-sm text-muted-foreground hidden sm:inline-block">
                    • {passenger.boardingStop}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                     Seat {passenger.seatSelection}
                   </span>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <Button
          onClick={handleEndTurn}
          disabled={isEnding}
          className="w-full shadow-md transition-all overflow-hidden"
          size="lg">
          
          {isEnding ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 animate-pulse" />
              Completing Turn...
            </motion.div>
          ) : (
            "End Turn"
          )}
        </Button>
      </CardContent>
    </Card>);

}
