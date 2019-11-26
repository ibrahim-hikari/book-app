<div>
                        <form action="/selectform" method="post">
                            <button type="submit">SELECT</button>
                            <input type="text" name="title" value="<%= book.title%>">
                            <input type="text" name="authors" value="<%= book.authors%>">
                            <input type="text" name="isbn" value="<%= book.ISBN%>">
                            <input type="text" name="description" value="<%= book.description%>">
                        </form>
                    </div> 