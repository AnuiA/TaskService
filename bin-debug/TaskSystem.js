var Task = (function () {
    function Task(id, name, status, fromNpcId, toNpcId) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;
    }
    var d = __define,c=Task,p=c.prototype;
    p.getId = function () {
        return this.id;
    };
    p.getName = function () {
        return this.name;
    };
    p.getStatus = function () {
        return this.status;
    };
    p.getFromNpcId = function () {
        return this.fromNpcId;
    };
    p.getToNpcId = function () {
        return this.toNpcId;
    };
    p.setStatus = function (taskStatus) {
        this.status = taskStatus;
    };
    return Task;
}());
egret.registerClass(Task,'Task');
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["UNACCEPTABLE"] = 0] = "UNACCEPTABLE";
    TaskStatus[TaskStatus["ACCEPTABLE"] = 1] = "ACCEPTABLE";
    TaskStatus[TaskStatus["DURING"] = 2] = "DURING";
    TaskStatus[TaskStatus["CANSUBMIT"] = 3] = "CANSUBMIT";
    TaskStatus[TaskStatus["SUBMITTED"] = 4] = "SUBMITTED";
})(TaskStatus || (TaskStatus = {}));
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["SUCCESS"] = 0] = "SUCCESS";
    ErrorCode[ErrorCode["MISSING_TASK"] = 1] = "MISSING_TASK";
})(ErrorCode || (ErrorCode = {}));
var TaskService = (function () {
    function TaskService() {
        this.taskList = [];
        this.observerList = [];
        TaskService.count++;
        if (TaskService.count > 1) {
            throw 'singleton!!!';
        }
    }
    var d = __define,c=TaskService,p=c.prototype;
    //获取TaskService的实例
    TaskService.getInstance = function () {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    };
    //不公开数据，交给调用方处理
    p.getTaskByCustomRule = function (rule) {
        //拷贝数据
        var clone = this.taskList;
        //为传入函数增加了参数
        return rule(clone);
    };
    p.addTask = function (task) {
        this.taskList.push(task);
    };
    p.addObserver = function (observer) {
        this.observerList.push(observer);
    };
    //完成任务时调用
    p.finish = function (id) {
        if (id == "") {
            return ErrorCode.MISSING_TASK;
        }
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getId() == id) {
                this.taskList[i].setStatus(TaskStatus.SUBMITTED);
                this.notify(this.taskList[i]);
                break;
            }
        }
        return ErrorCode.SUCCESS;
    };
    //接受任务时调用
    p.accept = function (id) {
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getId() == id && this.taskList[i].getStatus() == TaskStatus.ACCEPTABLE) {
                this.taskList[i].setStatus(TaskStatus.DURING);
                this.notify(this.taskList[i]);
                break;
            }
        }
    };
    //将任务发送给所有观察者,并让观察者进行相应的处理
    //只能内部调用
    p.notify = function (task) {
        for (var i = 0; i < this.observerList.length; i++) {
            this.observerList[i].onChange(task);
        }
    };
    TaskService.count = 0;
    return TaskService;
}());
egret.registerClass(TaskService,'TaskService');
var TaskPanel = (function () {
    function TaskPanel(id) {
        this.id = id;
    }
    var d = __define,c=TaskPanel,p=c.prototype;
    p.getId = function () {
        return this.id;
    };
    p.onChange = function (task) {
        if (task.getStatus() == TaskStatus.ACCEPTABLE) {
            new Main().showPanel(task, "taskpanel not accept");
        }
        if (task.getStatus() == TaskStatus.DURING) {
            new Main().showPanel(task, "taskpanel accept");
        }
        if (task.getStatus() == TaskStatus.SUBMITTED) {
            new Main().showPanel(task, "taskpanel submit");
        }
        if (task.getStatus() == TaskStatus.ACCEPTABLE && Main.click) {
            new Main().showPanel(task, "accept");
        }
        else if (task.getStatus() == TaskStatus.DURING) {
            new Main().showPanel(task, "finish");
        }
        Main.click = false;
    };
    return TaskPanel;
}());
egret.registerClass(TaskPanel,'TaskPanel',["Observer"]);
var NPC = (function () {
    function NPC(id) {
        this.id = id;
    }
    var d = __define,c=NPC,p=c.prototype;
    p.getId = function () {
        return this.id;
    };
    p.setEmoji = function (emoji) {
        this.emoji = emoji;
    };
    //根据变化的任务的相应状态改变相应NPC头顶的符号
    p.onChange = function (task) {
        //任务刚创建时
        if (task.getStatus() == TaskStatus.ACCEPTABLE) {
            if (this.id == task.getFromNpcId()) {
                this.emoji = "yellow !";
            }
        }
        else if (task.getStatus() == TaskStatus.DURING) {
            if (this.id == task.getFromNpcId()) {
                this.emoji = "";
            }
            if (this.id == task.getToNpcId()) {
                this.emoji = "yellow ?";
            }
        }
        else if (task.getStatus() == TaskStatus.SUBMITTED) {
            this.emoji = "";
        }
        new Main().showEmoji(this.emoji);
    };
    return NPC;
}());
egret.registerClass(NPC,'NPC',["Observer"]);
//# sourceMappingURL=TaskSystem.js.map