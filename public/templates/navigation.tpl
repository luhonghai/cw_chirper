<nav class="navbar navbar-fixed-top header">
    <div class="header-container">
        <div class="navbar-header">

            <a href="#" class="navbar-brand">Chirper</a>
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse1">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>

        </div>
        <div class="collapse navbar-collapse" id="navbar-collapse1">
            <ul class="nav navbar-nav navbar-right navbar-header-fixed">
                <li>
                    <form class="navbar-form">
                        <div class="input-group search-container">
                            <input type="text" class="form-control" placeholder="Search" name="q" id="q">
                            <div class="input-group-btn">
                                <button class="btn btn-default btn-primary" type="submit"><i class="glyphicon glyphicon-search"></i></button>
                            </div>
                        </div>
                    </form>
                </li>
                <li><a href="#aboutModal" role="button" data-toggle="modal"><i class="glyphicon glyphicon-exclamation-sign"></i> About</a></li>
                <li id="notificationModal" style="display: none">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-bell"></i> Notification</a>
                    <ul class="dropdown-menu">
                        <li><a href="#"><span class="badge pull-right">40</span>Link</a></li>
                        <li><a href="#"><span class="badge pull-right">2</span>Link</a></li>
                        <li><a href="#"><span class="badge pull-right">0</span>Link</a></li>
                        <li><a href="#"><span class="label label-info pull-right">1</span>Link</a></li>
                        <li><a href="#"><span class="badge pull-right">13</span>Link</a></li>
                    </ul>
                </li>
                {*<li><a href="#" id="btnToggle"><i class="glyphicon glyphicon-th-large"></i></a> View</li>*}
                <li><a href="#loginModal" id="profileAction"><i class="glyphicon glyphicon-user"></i> Login</a></li>

            </ul>
        </div>
    </div>
</nav>