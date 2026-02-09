import 'package:hive/hive.dart';
import 'dart:core';

part 'Reminder.g.dart';

@HiveType(typeId: 1)
class Reminder {
  @HiveField(0)
  String title;
  @HiveField(1)
  String description;
  @HiveField(2)
  bool checkNotification = false;
  @HiveField(3)
  bool checkAlarm = false;
  @HiveField(4)
  String distance;
  @HiveField(5)
  String location;
  @HiveField(6)
  String date;
  @HiveField(7)
  bool isComplete = false;
  Reminder(
      {this.title,
      this.description,
      this.checkNotification,
      this.checkAlarm,
      this.distance,
      this.location,
      this.date,
      this.isComplete});
}
