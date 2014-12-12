<script id="post-template" type="text/x-handlebars-template">
    {literal}
    <div class="panel panel-default post-container" pid="{{id}}" uid="{{user_id}}">
        <div class="panel-heading">
            <button type="button" style="display: none" pid="{{id}}" uid="{{user_id}}" title="Delete this post" class="close pull-right delete-post">×</button>
            <h4>{{song}}</h4>
        </div>
        <div class="panel-body">
            {{#if image}}
        <img src="{{image}}" class="img-circle pull-right post-image">
            {{/if}}
        <a><i class="glyphicon glyphicon-user"></i> {{artist}}</a>
        <p>{{comment}}</p>
        <div class="clearfix"></div>
        <hr>
        <p class="post-author">Posted <span class="posted-time" title="{{timestamp}}"></span> by <a href="u?#{{user_id}}"><b>{{author_fullname}}</b></a></p>
        <div class="comment-container comment-container-{{id}}">
        <table cellpadding="5" cellspacing="5">

        </table>
        </div>
        <div class="input-group">
        <div class="input-group-btn">
        <button class="btn btn-default"><i class="glyphicon glyphicon-heart-empty"></i></button>
        <button class="btn btn-default button-comment"><i class="glyphicon glyphicon-send"></i></button>
        </div>
        <input type="text" pid="{{id}}" uid="{{user_id}}" class="form-control input-comment" placeholder="Add a comment..">
        </div>

    </div>
    </div>
    {/literal}
</script>

<script id="comment-template" type="text/x-handlebars-template">
    {literal}
    <tr pid="{{post_id}}" uid="{{user_id}}" cid="{{id}}">
    <td class="post-avatar-container">
        <img src="images/no-avatar.png" class="img-circle post-avatar">
    </td>
    <td>
    <p><a href="u?#{{user_id}}"><b>{{user_fullname}}</b></a> <span class="posted-time" title="{{timestamp}}"></span></p>
    <p>{{comment}}</p>
    </td>
    </tr>
    {/literal}
</script>