@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Hero
    @endmarkdown

    @doc(['slug' => 'hero'])
    @enddoc
@stop
