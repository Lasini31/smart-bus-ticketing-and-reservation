import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Badge } from "./components/ui/badge";
import { ScrollArea } from "./components/ui/scroll-area";
import { DriverProfile } from "./components/DriverProfile";
import { ActiveTurn } from "./components/ActiveTurn";
import { CompletedTurnDetails } from "./components/CompletedTurnDetails";
import { Bus, Clock, User, Play, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { driverApi } from "../api/driverApi";


export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [driverData, setDriverData] = useState(null);
  const [busNo, setBusNo] = useState("");
  const [busRoute, setBusRoute] = useState("");
  const [activeTurn, setActiveTurn] = useState(null);
  const [viewingCompletedTurn, setViewingCompletedTurn] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [turns, setTurns] = useState([]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await driverApi.getDriverProfile("DRV-123");
        setDriverData(JSON.parse(data.driverProfile));
        setBusNo(data.busNo);
        setBusRoute(data.busTurn);
        setTurns(JSON.parse(data.schedule));
      } catch (error) {
        console.error("Failed to load driver profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const startTurn = async (turnId) => {
    await driverApi.startShift("DRV-123");
    const fetchedPassengers = await driverApi.getPassengers("DRV-123");
    setPassengers(fetchedPassengers.map((p) => ({ ...p, boarded: false })));

    setActiveTurn(turnId);
    setViewingCompletedTurn(null);
    setTurns((prev) => {
      let reachedTarget = false;
      return prev.map((t) => {
        if (t.id === turnId) {
          reachedTarget = true;
          return { ...t, status: "active" };
        }
        if (!reachedTarget && t.status === "pending") {
          return { ...t, status: "incompleted" };
        }
        return t;
      });
    });
  };

  const endTurn = async () => {
    if (activeTurn) {
      await driverApi.endShift("DRV-123");
      setTurns((prev) => prev.map((t) => t.id === activeTurn ? { ...t, status: "completed" } : t));
      setActiveTurn(null);
    }
  };

  const viewCompletedTurn = (turnId) => {
    setViewingCompletedTurn(turnId);
  };

  const backToActiveTurn = () => {
    setViewingCompletedTurn(null);
  };

  const togglePassenger = (passengerId) => {
    setPassengers((prev) => prev.map((p) => p.passengerId === passengerId ? { ...p, boarded: !p.boarded } : p));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":return "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-md shadow-primary/30";
      case "completed":return "bg-primary/15 text-primary border-primary/30 shadow-sm";
      case "incompleted":return "bg-destructive/15 text-destructive border-destructive/30 shadow-sm";
      case "pending":return "bg-muted text-muted-foreground border-border";
    }
  };

  if (isLoading || !driverData) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Loading Schedule...</p>
      </div>
    );
  }

  // ── Main dashboard ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-transparent p-6 relative overflow-hidden">

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Top Navigation Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-primary/20 shadow-sm mb-8">
          
          {/* Logo Area */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-md shadow-primary/20 font-bold text-xl tracking-tighter">
              STAR
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Smart Bus Ticketing</span>
              <span className="text-xl font-bold text-foreground">Driver Home</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/10 font-semibold">
              Home
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/10 font-semibold gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0 flex flex-col" aria-describedby={undefined}>
                <ScrollArea className="h-[80vh] w-full">
                  <div className="p-6">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Driver Profile</DialogTitle>
                    </DialogHeader>
                    <div className="mt-6">
                      <DriverProfile driverData={driverData} />
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <Button variant="default" className="ml-2 font-semibold shadow-sm">
              Logout
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Bus info & schedule */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-primary/20 shadow-2xl shadow-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-3xl font-bold text-foreground">
                    Bus Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="busNo" className="text-primary">Bus Number</Label>
                    <Input
                      id="busNo"
                      value={busNo}
                      onChange={(e) => setBusNo(e.target.value)}
                      className="bg-input-background border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="busRoute" className="text-primary">Bus Route</Label>
                    <Input
                      id="busRoute"
                      value={busRoute}
                      onChange={(e) => setBusRoute(e.target.value)}
                      className="bg-input-background border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-primary/20 shadow-2xl shadow-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-3xl font-bold text-foreground">
                    Bus Turn Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {turns.map((turn, index) =>
                    <motion.div
                      key={turn.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`p-4 rounded-lg border transition-all ${
                      turn.status === "active" ? "border-primary bg-gradient-to-r from-primary/10 to-primary/5 shadow-lg shadow-primary/20" :
                      turn.status === "completed" ? "border-border hover:border-primary/40 hover:shadow-md cursor-pointer" :
                      turn.status === "incompleted" ? "border-destructive/30 bg-destructive/5 hover:shadow-md" :
                      "border-border hover:border-primary/40 hover:shadow-md"}`
                      }
                      onClick={() => {
                        if (turn.status === "completed") {
                          viewCompletedTurn(turn.id);
                        }
                      }}>
                      
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Clock className={`w-5 h-5 drop-shadow-sm ${turn.status === "incompleted" ? "text-destructive" : "text-primary"}`} />
                            <span className="font-medium">{turn.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(turn.status)}>
                              {turn.status === "active" && <Play className="w-3 h-3 mr-1" />}
                              {turn.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                              {turn.status === "incompleted" && <XCircle className="w-3 h-3 mr-1" />}
                              {turn.status.charAt(0).toUpperCase() + turn.status.slice(1)}
                            </Badge>
                            {turn.status === "pending" &&
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              startTurn(turn.id);
                            }}
                            disabled={activeTurn !== null}
                            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            
                                Start Turn
                              </Button>
                          }
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right — Active turn / completed / empty */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            {viewingCompletedTurn ?
            <CompletedTurnDetails
              turnTime={turns.find((t) => t.id === viewingCompletedTurn)?.time || ""}
              onBack={backToActiveTurn} /> :

            activeTurn ?
            <ActiveTurn
              turnTime={turns.find((t) => t.id === activeTurn)?.time || ""}
              passengers={passengers}
              onEndTurn={endTurn}
              onPassengerToggle={togglePassenger} /> :


            <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg shadow-primary/10">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[500px] text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                    <Clock className="w-10 h-10 text-primary drop-shadow-sm" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Active Turn</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Start a turn from your schedule to begin tracking passengers and manage your route. Click on completed turns to view journey details.
                  </p>
                </CardContent>
              </Card>
            }
          </motion.div>
        </div>
      </div>

    </div>);

}
