<script id="post-template" type="text/x-handlebars-template">
    {literal}
    <div class="panel panel-default post-container" pid="{{id}}" uid="{{user_id}}">
        <div class="panel-heading"><h4>{{song}}</h4></div>
        <div class="panel-body">
            {{#if image}}
        <img src="{{image}}" class="img-circle pull-right post-image">
            {{/if}}
        <a href="#"><i class="glyphicon glyphicon-user"></i> {{artist}}</a>
        <p>{{comment}}</p>
        <div class="clearfix"></div>
        <hr>
        <p class="post-author">Posted <span class="posted-time" title="{{timestamp}}"></span> by <a href="#"><b>{{author_fullname}}</b></a></p>
        <div class="comment-container comment-container-{{id}}">
        <table>

        </table>
        </div>
        <form>
        <div class="input-group">
        <div class="input-group-btn">
        <button class="btn btn-default"><i class="glyphicon glyphicon-heart-empty"></i></button>
        <button class="btn btn-default"><i class="glyphicon glyphicon-send"></i></button>
        </div>
        <input type="text" pid="{{id}}" uid="{{user_id}}" class="form-control" placeholder="Add a comment..">
        </div>
        </form>

    </div>
    </div>
    {/literal}
</script>

<script id="comment-template" type="text/x-handlebars-template">
    {literal}
    <tr pid="{{post_id}}" uid="{{user_id}}" cid="{{comment_id}}">
    <td class="post-avatar-container">
        <img src="images/no-avatar.png" class="img-circle post-avatar">
    </td>
    <td>
    <p><a href="#"><b>{{user_fullname}}</b></a> <span class="posted-time" title="{{timestamp}}"></span></p>
    <p>{{comment}}</p>
    </td>
    </tr>
    {/literal}
</script>