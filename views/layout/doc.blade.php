<section id="docblock-{{rand(0,99999)}}" class="example">
    <h3>Example</h3>
    <div class="markup-preview">
        {!! $slot !!}
    </div>
    @code(['language' => 'html', 'content' => ""]) 
        {{ \HbgStyleGuide\Helper\ParseString::tidyHtml($slot)}}
    @endcode

    @if(isset($slug))

    <h3>Blade component</h3>
    <pre><code>{{"@"}}{{$slug}}{{"['parameter' => 'value']"}}
    {{'$slot'}}
{{"@end"}}{{$slug}}</code></pre>

    @endif

    @if(isset($settings))
        <h3>Blade component parameters</h3>
        <table>
            <thead>
                <td>Key</td>
                <td>Default value</td>
            </thead>
            @foreach($settings as $key => $item)
                <tr>
                    <td>{{$key}}</td>
                    @if(is_array($item)||is_object($item)) 
                    <td>{{json_encode($item)}}</td>
                    @else
                    <td>{{$item}}</td>
                    @endif
                </tr>
            @endforeach
        </table>
        <small><strong>Settings location:</strong> {{$settingsLocation}}</small>
    @endif


    

</section>