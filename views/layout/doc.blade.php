<section id="docblock-{{rand(0,99999)}}" class="example">
@if($examples)
        <div class="grid">
        @foreach($examples as $key => $example)

            @if(isset($example['description']['grid']) && !empty($example['description']['grid']))
                @php
                      $componentDesc = [
                        '--component-description-area'
                      ];

                      $codeArea = [
                        'c-paper--component-code-area-grid'
                      ];
                @endphp
            @else
                @php
                    $componentDesc = [
                        'c-paper--component-description-area',
                        'c-paper--component-description-area-full'
                    ];

                    $codeArea = [
                        'c-paper--component-code-area-full'
                    ];

                    $example['description']['grid'] = 'grid-md-12';
                @endphp
            @endif

            <div class="{{$example['description']['grid']}}">

                @paper([
                    'padding' => $paper['containerPadding'],
                    'transparent' => $paper['transparencyContainer']
                ])

                    @typography([
                        'variant' => "h3",
                        'element' => "h3"
                    ])
                        {{$example['description']['heading']}}
                    @endtypography

                    <div>
                        @include($example['component'])
                    </div>

                    @typography([
                        'variant' => "h4",
                        'element' => "h4",
                    ])
                    @icon([
                        'icon' => 'info',
                        'size' => 'md',
                        'color' => 'gray'
                    ])
                    @endicon


                    {{$example['description']['subHeading']}}
                    @endtypography
                    @typography([
                        "variant" => "caption",
                        "element" => "p"
                    ])
                        {{$example['description']['text']}}
                    @endtypography

                    @buttonGroup(['borderColor' => 'default'])
                    @button([
                        'text' => 'HTML',
                        'size' => 'md',
                        'icon' => 'code',
                        'toggle' => true,
                        'attributeList' => ['js-toggle-trigger' => $example['html']['id'], 'js-toggle-group' => $loop->index]
                    ])
                    @endbutton
                    @button([
                        'text' => 'Blade',
                        'size' => 'md',
                        'icon' => 'code',
                        'toggle' => true,
                        'attributeList' => ['js-toggle-trigger' => $example['blade']['id'], 'js-toggle-group' => $loop->index]
                    ])
                    @endbutton
                    @endbuttonGroup
                @endpaper
                    @paper([
                        'classList' => $codeArea
                    ])
                    @code(['language' => 'html', 'content' => "", 'classList' => ['u-display--none'], 'attributeList' => ['js-toggle-item' => $example['html']['id'], 'js-toggle-class' => 'u-display--block', 'js-toggle-group' => $loop->index]])
                        {{ \HbgStyleGuide\Helper\ParseString::tidyHtml($example['html']['code'])}}
                    @endcode
                @endpaper

                @paper([
                    'classList' => $codeArea
                ])
                
                    @code(['language' => 'php', 'content' => "", 'classList' => ['u-display--none'], 'attributeList' => ['js-toggle-item' => $example['blade']['id'], 'js-toggle-class' => 'u-display--block', 'js-toggle-group' => $loop->index]])
                        {{$example['blade']['code']}}
                    @endcode
               
                @endpaper
            </div>
        @endforeach
        </div>

    @else
        @paper(['padding' => 3])

            <div class="markup-preview">
                {!! $slot !!}
            </div>

        @endpaper
    @endif

    @if(isset($settings) && isset($slug) && !empty($slug))
        @if(isset($displayParams) && !empty($displayParams))
        @paper(['padding' => 3])
            <h3>Blade component parameters</h3>
            <table>
                <thead>
                    <td>Key</td>
                    <td>Default value</td>
                    <td>Type</td>
                    <td>Description</td>
                </thead>
                @foreach($settings as $key => $item)
                    <tr>
                        <td>{{$key}}</td>
                        @if(is_array($item)||is_object($item))
                        <td>{{json_encode($item)}}</td>
                        @elseif(is_bool($item))
                        <td>{{$item ? 'true' : 'false'}}</td>
                        @else
                        <td>{{$item}}</td>
                        @endif
                        <td>{{gettype($item)}}</td>


                        @if(isset($description[$key]))
                        <td>{{$description[$key]}}</td>
                        @else
                        <td>-</td>
                        @endif
                    </tr>
                @endforeach

                <!-- Class list -->
                <tr>
                    <td>id</td>
                    <td></td>
                    <td>string</td>
                    <td>The DOM id of the component, will be autogenerated based on a hash of the data object.</td>
                </tr>

                <!-- Class list -->
                <tr>
                    <td>classList</td>
                    <td>[]</td>
                    <td>array</td>
                    <td>Array containing wrapping classes array</td>
                </tr>

                <!-- Attribute list -->
                <tr>
                    <td>attributeList</td>
                    <td>[]</td>
                    <td>array</td>
                    <td>Array containing keys and values rendered as attributes</td>
                </tr>

            </table>
        @endpaper
        <small><strong>Settings location:</strong> {{$settingsLocation}}</small>
        @endif
    @endif
</section>