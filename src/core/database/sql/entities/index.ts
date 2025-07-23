import { Donation } from "./donation.entity";
import { Event } from "./event.entity";
import { Location } from "./location.entity";
import { LocationContact } from "./locationContact.entity";
import { LocationDetail } from "./locationDetail.entity";
import { Record } from "./record.entity";
import { Region } from "./region.entity";
import { User } from "./user/user.entity";
import { RefreshToken } from "./refresh-token";

export const entities = [User, Location, Donation, Event, Record, Region, LocationContact, LocationDetail, RefreshToken];
