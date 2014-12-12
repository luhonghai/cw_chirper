{include file="header.tpl"}
{include file="navigation.tpl"}
<!--main-->
<div class="container" id="main">
    <div class="row">

        <div class="col-md-12">
            <div class="main-message"></div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-4 well-stream">
            <div class="well well-sm user-profile-container" style="display: none">
                <div class="media">
                    <a class="thumbnail pull-left" href="#">
                        <img class="media-object user-profile-avatar" src="images/no-avatar.png">
                    </a>
                    <div class="media-body">
                        <h4 class="media-heading user-profile-fullname"></h4>
                        <p>
                            <a href="#" class="btn btn-xs btn-default"><span class="glyphicon glyphicon-comment"></span> Message</a>
                            <a href="#" class="btn btn-xs btn-default"><span class="glyphicon glyphicon-heart"></span> Favorite</a>
                        </p>
                    </div>
                </div>
            </div>
            <div class="well stream-quick-sign-up" style="display: none">
                <h4>Sign-up now!</h4>
                <div class="input-group text-center">
                    <input type="text" name="quick-signup-email" class="form-control input-lg" placeholder="Enter your email address">
                    <span class="input-group-btn"><button class="btn btn-lg btn-primary quick-signup-button" type="button">OK</button></span>
                </div>
            </div>

            <div class="well stream-quick-post" style="display: none">
                <form class="form-horizontal" role="form">
                    <h4>New review</h4>
                    <div class="form-group post-form-item">
                        <input type="text" name="song" class="form-control" placeholder="Song name"/>
                    </div>
                    <div class="form-group post-form-item">
                        <input type="text" name="artist" class="form-control" placeholder="Artist name"/>
                    </div>
                    <div class="form-group post-form-item">
                        <textarea class="form-control" name="comment" placeholder="Your comment"></textarea>
                    </div>
                    <button class="btn btn-success pull-right post-submit" type="button">Post</button>
                    <ul class="list-inline">
                        <li>
                            <a href="#"><i class="glyphicon glyphicon-picture"></i></a>
                        </li>
                        <li>
                            <a href="#" style="" ><i class="glyphicon glyphicon-map-marker"></i></a>
                        </li>

                    </ul>
                </form>
            </div>
        </div>
        <div class="col-md-8 post-stream">
            <div class="post-anchor"></div>
        </div>
    </div>
</div><!--/main-->
{include file="jstemplate.tpl"}
{include file="modal.tpl"}
{include file="footer.tpl"}