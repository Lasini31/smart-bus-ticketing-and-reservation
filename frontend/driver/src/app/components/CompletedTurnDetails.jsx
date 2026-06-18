import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { CheckCircle2, Users, Clock, MapPin, TrendingUp, Star, ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";













export function CompletedTurnDetails({ turnTime, onBack }) {
  const [expandedStop, setExpandedStop] = useState(null);

  const journeyData = {
    totalPassengers: 24,
    boardedPassengers: 24,
    averageRating: 4.9,
    completionTime: "3h 45m",
    routeStops: [
    { name: "Main Street", passengers: 4, time: "10:35 AM", droppedOffPassengers: ["John Smith", "Emily Davis", "Robert Garcia", "Amanda Wilson"] },
    { name: "Park Avenue", passengers: 3, time: "10:52 AM", droppedOffPassengers: ["Sarah Johnson", "Michael Chen", "Jessica Martinez"] },
    { name: "Central Station", passengers: 5, time: "11:15 AM", droppedOffPassengers: ["Michael Brown", "David Wilson", "Lisa Anderson", "Chris Taylor", "Rachel Lee"] },
    { name: "Market Square", passengers: 6, time: "11:40 AM", droppedOffPassengers: ["James Anderson", "Maria Garcia", "Kevin Thompson", "Jennifer White", "Steven Harris", "Nicole Scott"] },
    { name: "University Campus", passengers: 4, time: "12:20 PM", droppedOffPassengers: ["Daniel Rodriguez", "Michelle Young", "Brandon King", "Angela Hernandez"] },
    { name: "Shopping Mall", passengers: 2, time: "12:55 PM", droppedOffPassengers: ["Jason Walker", "Sophia Robinson"] }],

    startTime: "10:30 AM",
    endTime: "2:15 PM"
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-primary/30 shadow-xl shadow-primary/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Completed Journey
            </CardTitle>
            <CardDescription className="text-muted-foreground flex items-center gap-2 mt-2">
              <Clock className="w-4 h-4" />
              {turnTime}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {onBack &&
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="gap-1 border-primary/30 hover:border-primary hover:bg-primary/10 text-primary">
              
                <ArrowLeft className="w-4 h-4" />
                Back to Active
              </Button>
            }
            <Badge className="bg-primary/15 text-primary border-primary/30 shadow-sm">
              Completed
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            
            <div className="flex items-center gap-2 text-primary mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Passengers</span>
            </div>
            <p className="text-2xl font-bold">{journeyData.totalPassengers}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            
            <div className="flex items-center gap-2 text-primary mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Boarded</span>
            </div>
            <p className="text-2xl font-bold">{journeyData.boardedPassengers}</p>
          </motion.div>



          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            
            <div className="flex items-center gap-2 text-primary mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Duration</span>
            </div>
            <p className="text-2xl font-bold">{journeyData.completionTime}</p>
          </motion.div>
        </div>

        <Separator className="my-6" />

        {/* Journey Timeline */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Journey Timeline
          </h3>
          <div className="space-y-3">
            {journeyData.routeStops.map((stop, index) => {
              const isExpanded = expandedStop === index;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}>
                  
                  <button
                    onClick={() => setExpandedStop(isExpanded ? null : index)}
                    className="w-full text-left flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                    
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{stop.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        <Users className="w-3 h-3 mr-1" />
                        {stop.passengers}
                      </Badge>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <ChevronDown
                      className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform"
                      style={{
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)"
                      }} />
                    
                  </button>

                  {isExpanded &&
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    
                      <div className="px-3 pb-3">
                        <div className="border-t border-border/40 pt-3 mt-3 ml-4 pl-4">
                          <div className="space-y-2">
                            {stop.droppedOffPassengers.map((passenger, passengerIndex) =>
                          <p key={passengerIndex} className="text-sm text-gray-600">
                                {passenger}
                              </p>
                          )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  }
                </motion.div>);

            })}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Journey Summary */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Start Time</p>
              <p className="text-lg font-semibold text-primary">{journeyData.startTime}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Duration</p>
              <p className="text-lg font-semibold text-primary">{journeyData.completionTime}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">End Time</p>
              <p className="text-lg font-semibold text-primary">{journeyData.endTime}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>);

}
