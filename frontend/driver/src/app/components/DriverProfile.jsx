import { Phone, Mail, MapPin, Calendar, Award, Clock, User, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";















export function DriverProfile({ driverData }) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg shadow-primary/10 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg shadow-primary/30">
            <AvatarImage src="" alt={driverData.name} />
            <AvatarFallback className="bg-white text-primary text-2xl">
              {driverData.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl text-white">{driverData.name}</CardTitle>
            <p className="text-primary-foreground/80">Driver ID: {driverData.id}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="bg-primary-foreground/10 text-white border-white/30">{driverData.totalTrips} Trips</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-base">{driverData.phone}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{driverData.email}</p>
            </div>
          </div>



          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">License Number</p>
              <p className="text-base">{driverData.licenseNumber}</p>
            </div>
          </div>



          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created Date</p>
              <p className="text-base">{driverData.createdDate}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-base">{driverData.lastUpdated}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-base capitalize">{driverData.status}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Employer ID</p>
              <p className="text-base">{driverData.employerId}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>);

}
