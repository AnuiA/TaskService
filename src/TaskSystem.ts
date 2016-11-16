class Task{

    private id : String;
    private name : string;
    private desc : String;
    private status : TaskStatus;
    private fromNpcId : String;
    private toNpcId : String;


    constructor(id : String, name : string, status : TaskStatus, fromNpcId : String, toNpcId : String){
        this.id = id;
        this.name = name;
        this.status = status;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;

    }

    public getId() : String{
        return this.id;
    }

    public getName() : string{
        return this.name;
    }

    public getStatus() : TaskStatus{
        return this.status;
    }

    public getFromNpcId() : String{
        return this.fromNpcId;
    }

    public getToNpcId() : String{
        return this.toNpcId;
    }

    public setStatus(taskStatus : TaskStatus) : void{
        this.status = taskStatus;
    }
}    


enum TaskStatus{
    UNACCEPTABLE = 0,
    ACCEPTABLE = 1,
    DURING = 2,
    CANSUBMIT = 3,
    SUBMITTED = 4
}


enum ErrorCode{
    SUCCESS,
    MISSING_TASK
}



class TaskService{

    //全局变量，一个模块最多一个（任务系统等）
    private static instance : TaskService;
    private static count = 0;
    public taskList : Task[] = [];
    public observerList : Observer[] = [];

    constructor(){
        TaskService.count++;
        if(TaskService.count > 1){
            throw 'singleton!!!';
        }
    }


    //获取TaskService的实例
    public static getInstance(){
        if(TaskService.instance == null){
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    }


    //不公开数据，交给调用方处理
    public getTaskByCustomRule(rule : Function) : Task{

        //拷贝数据
        var clone = this.taskList;

        //为传入函数增加了参数
        return rule(clone);

    }


    public addTask(task : Task){
        this.taskList.push(task);
    }


    public addObserver(observer : Observer){
        this.observerList.push(observer);
    }

    //完成任务时调用
    public finish(id : String) : ErrorCode{
        if(id == ""){
            return ErrorCode.MISSING_TASK;
        }

        for(var i = 0; i < this.taskList.length; i++){
            if(this.taskList[i].getId() == id){
                this.taskList[i].setStatus(TaskStatus.SUBMITTED);
                this.notify(this.taskList[i]);
                break;
            }
        }

        return ErrorCode.SUCCESS;
    }


    //接受任务时调用
    public accept(id : String) : void{
        for(var i = 0; i < this.taskList.length; i++){
            if(this.taskList[i].getId() == id && this.taskList[i].getStatus() == TaskStatus.ACCEPTABLE){
                this.taskList[i].setStatus(TaskStatus.DURING);
                this.notify(this.taskList[i]);
                break;
            }
        }
    }


    //将任务发送给所有观察者,并让观察者进行相应的处理
    //只能内部调用
    public notify(task : Task){
        for(var i = 0; i < this.observerList.length; i++){
            this.observerList[i].onChange(task);
        }
    }
}



class TaskPanel implements Observer{

    private id : String;

    constructor(id : String){
        this.id = id;
    }

    public getId() : String{
        return this.id;
    }


    onChange(task : Task){
        if(task.getStatus() == TaskStatus.ACCEPTABLE){
            new Main().showPanel(task, "taskpanel not accept");
        }
        if(task.getStatus() == TaskStatus.DURING){
            new Main().showPanel(task, "taskpanel accept");
        }
        if(task.getStatus() == TaskStatus.SUBMITTED){
            new Main().showPanel(task, "taskpanel submit");
        }
        if(task.getStatus() == TaskStatus.ACCEPTABLE && Main.click){
            new Main().showPanel(task, "accept");
        }else if(task.getStatus() == TaskStatus.DURING ){
            new Main().showPanel(task, "finish")
        }
        Main.click = false;
    }
}


class NPC implements Observer{

    private id : String;
    
    //头顶的提示任务状态的符号
    private emoji : String;

    constructor(id : String){
        this.id = id;
    }

    public getId() : String{
        return this.id;
    }

    public setEmoji(emoji : String){
        this.emoji = emoji;
    }


    //根据变化的任务的相应状态改变相应NPC头顶的符号
    onChange(task : Task){

        //任务刚创建时
        if(task.getStatus() == TaskStatus.ACCEPTABLE){
            if(this.id == task.getFromNpcId()){
                this.emoji = "yellow !";
            }
        }else if(task.getStatus() == TaskStatus.DURING){
            if(this.id == task.getFromNpcId()){
                this.emoji = "";
            }
            if(this.id == task.getToNpcId()){
                this.emoji = "yellow ?";
            }
        }else if(task.getStatus() == TaskStatus.SUBMITTED){
            this.emoji = "";
        }
        new Main().showEmoji(this.emoji);
    }
}

interface Observer{

    //接受到信息后进行相应的处理，信息作为参数可以是任意事物，如task等
    onChange(object : any);
}