import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:keiho/Constant.dart';
import 'package:keiho/Reminder.dart';
import 'package:hive/hive.dart';
import 'package:path_provider/path_provider.dart';
import 'package:hive_flutter/hive_flutter.dart';

enum TodoFilter { ALL, COMPLETED, INCOMPLETED }

class ReminderList extends StatefulWidget {
  @override
  _ReminderListState createState() => _ReminderListState();
}

class _ReminderListState extends State<ReminderList> {
  static const _kActionPaneType = <String, Widget>{
    'SlidableDrawerActionPane': SlidableDrawerActionPane(),
  };
  List<Slidable> _items;
  TodoFilter filter = TodoFilter.ALL;
  Box<Reminder> reminderBox;

  @override
  void initState() {
    super.initState();
    reminderBox = Hive.box<Reminder>(boxName);
  }

  @override
  Widget build(BuildContext context) {
//    _items=

    return Scaffold(
      appBar: AppBar(
        title: Text('Reminder List'),
        actions: <Widget>[
          PopupMenuButton<String>(
            onSelected: (value) {
              ///Todo : Take action accordingly
              ///
              if (value.compareTo("All") == 0) {
                setState(() {
                  filter = TodoFilter.ALL;
                });
              } else if (value.compareTo("Completed") == 0) {
                setState(() {
                  filter = TodoFilter.COMPLETED;
                });
              } else {
                setState(() {
                  filter = TodoFilter.INCOMPLETED;
                });
              }
            },
            itemBuilder: (BuildContext context) {
              return ["All", "Completed", "Incompleted"].map((option) {
                return PopupMenuItem(
                  value: option,
                  child: Text(option),
                );
              }).toList();
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: Column(children: <Widget>[
          ValueListenableBuilder(
              valueListenable: reminderBox.listenable(),
              builder: (context, Box<Reminder> todos, _) {
                List<int> keys;
                //=todos.keys.cast<int>().toList();

                if (filter == TodoFilter.ALL) {
                  keys = todos.keys.cast<int>().toList();
                  if (keys == null) return null;
                } else if (filter == TodoFilter.COMPLETED) {
                  keys = todos.keys
                      .cast<int>()
                      .where((key) => todos.get(key).isComplete)
                      .toList();
                  if (keys == null) return null;
                } else {
                  keys = todos.keys
                      .cast<int>()
                      .where((key) => !todos.get(key).isComplete)
                      .toList();
                  if (keys == null) return null;
                }

                return ListView.separated(
                  itemBuilder: (_, index) {
                    final int key = keys[index];
                    final Reminder todo = todos.get(key);
//                      print(todo.date);
                    //    print(todo.time);
                    //                    print(todo.distance);

                    return Slidable(
                      actionPane: SlidableDrawerActionPane(),
                      actions: <Widget>[
                        IconSlideAction(
                            caption: 'Mark Done',
                            color: Colors.blue,
                            icon: Icons.done_rounded,
                            onTap: () {
                              _showSnackBar('Marked done', key);
                              Reminder r = Reminder(
                                  title: todo.title,
                                  description: todo.description,
                                  checkAlarm: todo.checkAlarm,
                                  checkNotification: todo.checkNotification,
                                  distance: todo.distance,
                                  date: todo.date,
                                  location: todo.location,
                                  isComplete: true);
                              reminderBox.put(key, r);
                            }),
                        IconSlideAction(
                          caption: 'Mark undone',
                          color: Colors.grey,
                          icon: Icons.check_box_outline_blank_rounded,
                          onTap: () {
                            _showSnackBar('Marked un-done', key);
                            Reminder r = Reminder(
                                title: todo.title,
                                description: todo.description,
                                checkAlarm: todo.checkAlarm,
                                checkNotification: todo.checkNotification,
                                distance: todo.distance,
                                date: todo.date,
                                location: todo.location,
                                isComplete: false);
                            reminderBox.put(key, r);
                          },
                        ),
                      ],
                      secondaryActions: <Widget>[
                        IconSlideAction(
                          caption: 'Edit',
                          color: Colors.grey,
                          icon: Icons.edit,
                          onTap: () => _showSnackBar('Edit', key),
                        ),
                        IconSlideAction(
                          caption: 'Delete',
                          color: Colors.red,
                          icon: Icons.delete,
                          onTap: () {
                            _alertDialog(key);
                            //_showSnackBar('Delete', key);
                          },
                        ),
                      ],
                      child: ListTile(
                        leading: const Icon(Icons.swipe),
                        title: Text(todo.title),
                        subtitle: Text(todo.description),
                      ),
                    );
                  },
                  separatorBuilder: (_, index) => Divider(),
                  itemCount: keys.length,
                  shrinkWrap: true,
                );
              }),
        ]),
      ),
    );
  }

  void _showSnackBar(String message, int key) {
    print("delete");

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  Future<void> _alertDialog(int key) async {
    switch (await showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
              content: Text('Are you sure?'),
              title: Text('Alert'),
              actions: <Widget>[
                TextButton(
                  onPressed: () {
                    Navigator.pop(context, 'Yes');
                  },
                  child: const Text('Yes'),
                ),
                TextButton(
                    onPressed: () {
                      Navigator.pop(context, 'No');
                    },
                    child: const Text('No')),
              ]);
        })) {
      case "Yes":
        reminderBox.delete(key);

        _showSnackBar("Deleted", null);
        break;
      case "No:":
        break;
      default:
        break;
    }
  }
}
