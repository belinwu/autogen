// Copyright (c) Microsoft Corporation. All rights reserved.
// ResultSink.cs

using System.Threading.Tasks.Sources;

namespace Microsoft.AutoGen.Core;

internal interface IResultSink<TResult> : IValueTaskSource<TResult>, IValueTaskSource
{
    public void SetResult(TResult result);
    public void SetException(Exception exception);
    public void SetCancelled(OperationCanceledException? ocEx = null);

    public ValueTask<TResult> Future { get; }
    public ValueTask FutureNoResult { get; }
}

public sealed class ResultSink<TResult> : IResultSink<TResult>
{
    private ManualResetValueTaskSourceCore<TResult> core;

    public TResult GetResult(short token)
    {
        return this.core.GetResult(token);
    }

    public ValueTaskSourceStatus GetStatus(short token)
    {
        return this.core.GetStatus(token);
    }

    public void OnCompleted(Action<object?> continuation, object? state, short token, ValueTaskSourceOnCompletedFlags flags)
    {
        this.core.OnCompleted(continuation, state, token, flags);
    }

    public bool IsCancelled { get; private set; }
    public void SetCancelled(OperationCanceledException? ocEx = null)
    {
        this.IsCancelled = true;
        this.core.SetException(ocEx ?? new OperationCanceledException());
    }

    public void SetException(Exception exception)
    {
        this.core.SetException(exception);
    }

    public void SetResult(TResult result)
    {
        this.core.SetResult(result);
    }

    void IValueTaskSource.GetResult(short token) => _ = this.GetResult(token);

    public ValueTask<TResult> Future => new(this, this.core.Version);
    public ValueTask FutureNoResult => new(this, this.core.Version);
}

