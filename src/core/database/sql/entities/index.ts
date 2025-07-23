import { Donation } from "./donation/donation.entity";
import { Event } from "./event/event.entity";
import { Location } from "./location/location.entity";
import { LocationDetail } from "./locationDetail/locationDetail.entity";
import { Record } from "./record/record.entity";
import { Region } from "./region/region.entity";
import { User } from "./user/user.entity";

export const entities = [User, Location, Donation, Event, Record, Region, LocationDetail];
